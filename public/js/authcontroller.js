
const bcrypt = require('bcrypt');
const User = require('./userModel'); 

async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Busca al usuario en la base de datos
        const user = await User.findByUsername(username);
        
        // Verifica que el usuario existe y que la contraseña es correcta
        if (user && bcrypt.compareSync(password, user.password)) {
            // Guarda el rol en la sesión
            req.session.user = { id: user.id, role: user.role };
            
            // Devuelve el rol como respuesta
            res.send(user.role);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

module.exports = { login };
