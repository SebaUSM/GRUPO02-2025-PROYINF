const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function enviarNotificacionBackup(destinatario, archivoBackup) {
  const mailOptions = {
    from: `"Sistema de Respaldos" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Backup realizado correctamente',
    text: `Se ha generado un nuevo backup exitosamente: ${archivoBackup}`,
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log(`Notificación de backup enviada a ${destinatario}`);
      return true; 
    })
    .catch(err => {
      console.error('Error al enviar el correo:', err);
      return false; 
    });
}

module.exports = enviarNotificacionBackup;