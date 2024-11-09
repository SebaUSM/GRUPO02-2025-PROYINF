
const express = require('express');
const session = require('express-session');
const path = require('path');
const authController = require('./authcontroller');
const documentService = require('./services/documentGenerationService'); // Importa el servicio

const app = express();

app.use(express.json());
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: true
}));

// Ruta para generar un documento
app.post('/api/generate-document', async (req, res) => {
    try {
        const data = req.body;
        const document = await documentService.generateDocument(data);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el documento' });
    }
});

// Se verifica el estado del documento
app.get('/api/document-status/:id', async (req, res) => {
    try {
        const documentId = req.params.id;
        const status = await documentService.getDocumentStatus(documentId);
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el estado del documento' });
    }
});

// Se revisan las credenciales
app.post('/auth/login', authController.login);
app.get('/dashboard/admin', ensureRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});
app.get('/dashboard/maestro', ensureRole('maestro'), (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'maestro.html'));
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
