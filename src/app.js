const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Ajusta esta ruta si es necesario
const dashboardRoutes = require('./routes/dashboard'); // Asegúrate de que la ruta sea correcta
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(session({
    secret: 'tu_secreto',
    saveUninitialized: true,
    resave: false,
}));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Usar las rutas de autenticación
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes); // Asegúrate de que esto esté correcto

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});