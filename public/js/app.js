const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const authController = require('./authController');
const hashPasswords = require('./hashPasswords');
const pdfParse = require('pdf-parse');
const { realizarBackup, obtenerUltimoBackup, iniciarBackupsPeriodicos } = require('./backup');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

require('dotenv').config();
const { Pool } = require('pg');
const app = express();

// Configurar PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Backups automáticos y hash
hashPasswords();
iniciarBackupsPeriodicos();

// Middleware
app.use(express.json());
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para roles
function ensureRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).send('Acceso denegado');
    }
  };
}

// Login
app.post('/auth/login', authController.login);

// Dashboards
app.get('/dashboard/admin', ensureRole('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});
app.get('/dashboard/maestro', ensureRole('maestro'), (req, res) => {
  res.sendFile(path.join(__dirname, '../maestro.html'));
});

// Subida a DB
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file.buffer;
    const result = await pool.query(
      'INSERT INTO pdf_files (title, file) VALUES ($1, $2) RETURNING *',
      [title, file]
    );
    res.json({ message: 'Archivo subido con éxito', pdf: result.rows[0] });
  } catch (err) {
    console.error('Error al subir el archivo:', err);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Obtener PDF por ID
app.get('/pdf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pdf_files WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.contentType('application/pdf').send(result.rows[0].file);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
});

// Backup
app.post('/backup/trigger', async (req, res) => {
  try {
    const result = await realizarBackup();
    res.json({ mensaje: 'Backup generado exitosamente', archivo: result.path, correo: result.correo });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar el backup' });
  }
});

app.get('/backup/last', (req, res) => {
  try {
    const data = obtenerUltimoBackup();
    if (!data) return res.status(404).json({ error: 'No hay backups disponibles' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer el último backup' });
  }
});

// Listado de PDFs
const pdfFolder = path.join(__dirname, '..', 'pdfs');
app.get('/api/lista-pdfs', (req, res) => {
  fs.readdir(pdfFolder, (err, files) => {
    if (err) return res.status(500).json([]);
    const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    res.json(pdfs);
  });
});

// Utilidad para dividir texto
function dividirEnPartes(texto, maxPalabras) {
  const palabras = texto.split(/\s+/);
  const partes = [];
  for (let i = 0; i < palabras.length; i += maxPalabras) {
    partes.push(palabras.slice(i, i + maxPalabras).join(" "));
  }
  return partes;
}

// Procesamiento de PDF
app.post('/api/procesar-pdf', async (req, res) => {
  const { archivo, temas } = req.body;
  const filePath = path.join(pdfFolder, archivo);

  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const textoPlano = data.text;

    const partes = dividirEnPartes(textoPlano, 3000);
    const resultadosTotales = [];

    for (const parte of partes) {
      const prompt = `
Eres un asistente experto en curaduría de contenido agrícola.

Del siguiente texto, extrae únicamente los **párrafos completos** que mencionen **de forma explícita y relevante** todos estos temas: ${temas}.

Solo incluye párrafos donde los temas estén conectados de manera directa. Si un párrafo menciona uno solo superficialmente o sin contexto relevante, debe ser excluido.

Incluir si:
- Se menciona el tema de manera directa, en relación con investigación, impacto, resultados, iniciativas, cultivos o problemas agrícolas.
- Hay claridad en que se trata de contenido enfocado, no solo mención superficial.

Excluir si:
- El término aparece solo en una lista, resumen, o como mención lateral.
- No hay desarrollo o explicación relacionada al tema.

Devuelve únicamente los párrafos relevantes, separados por dos saltos de línea. No uses títulos, encabezados ni listas.
Texto:
"""${parte}"""
`;

      const respuesta = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 3072
      });

    const contenido = respuesta.choices[0].message.content.trim();

    if (contenido && contenido.length > 30 && !contenido.toLowerCase().includes("lo siento")) {
    const fragmentos = contenido
        .split(/\n\s*\n/)
        .map(f => f.trim())
        .filter(f => f.length > 50);

    const unicos = [...new Set(fragmentos)];

    const temasArray = temas.toLowerCase().split(',').map(t => t.trim());

    const relevantes = unicos.filter(parrafo =>
        temasArray.every(tema => parrafo.toLowerCase().includes(tema))
    );

    resultadosTotales.push(...relevantes);
    } else {
    console.warn("Respuesta vacía o irrelevante:", contenido.slice(0, 100));
    }
    }

    res.json(resultadosTotales);
  } catch (err) {
    console.error("Error al procesar PDF:", err.message);
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
