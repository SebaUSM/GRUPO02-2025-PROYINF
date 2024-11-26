const express = require('express');
const path = require('path'); // Asegúrate de importar path
const { ensureRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/admin', ensureRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/admin.html')); // Ajusta la ruta si es necesario
});

router.get('/maestro', ensureRole('maestro'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/maestro.html')); // Ajusta la ruta si es necesario
});

module.exports = router;