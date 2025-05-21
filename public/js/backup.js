const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const enviarNotificacionBackup = require('./notify');


const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const INTERVALO_MS = 1000 * 60 * 60 * 24; // cada 24 horas
const tablas = ['users', 'pdf_files'];

function FormatearFecha() {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const backupDir = path.join(__dirname, 'backups');

async function realizarBackup() {
  const backupData = {};
  for (const tabla of tablas) {
    try {
      const res = await pool.query(`SELECT * FROM ${tabla}`);
      backupData[tabla] = res.rows;
    } catch (err) {
      console.error(`Error al obtener datos de "${tabla}":`, err);
    }
  }

  const timestamp = FormatearFecha();
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const filePath = path.join(backupDir, `backup-completo-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

  console.log(`Backup guardado en: ${filePath}`);
  const resultadoCorreo = await enviarNotificacionBackup(process.env.ADMIN_EMAIL, filePath);

  return {
    path: filePath,
    data: backupData,
    correo: resultadoCorreo ? 'enviado' : 'falló'}; 


}

function iniciarBackupsPeriodicos() {
  realizarBackup(); 
  setInterval(realizarBackup, INTERVALO_MS);
}

function obtenerUltimoBackup() {
  if (!fs.existsSync(backupDir)) return null;

  const archivos = fs.readdirSync(backupDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (archivos.length === 0) return null;

  const ultimo = path.join(backupDir, archivos[0]);
  const data = JSON.parse(fs.readFileSync(ultimo));
  return data;
}

module.exports = {
  iniciarBackupsPeriodicos,
  realizarBackup,
  obtenerUltimoBackup
};
