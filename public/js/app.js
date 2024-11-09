const express = require('express');
const session = require('express-session');
const path = require('path');
const authController = require('./authcontroller');

const app = express();

app.use(express.json());
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: true
}));

function ensureRole(role) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).send('Acceso denegado');
        }
    };
}

// Ruta de inicio de sesión
app.post('/auth/login', authController.login);

// Ruta protegida para admin.html
app.get('/dashboard/admin', ensureRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Ruta protegida para maestro.html
app.get('/dashboard/maestro', ensureRole('maestro'), (req, res) => {
    res.sendFile(path.join(__dirname, 'maestro.html'));
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
