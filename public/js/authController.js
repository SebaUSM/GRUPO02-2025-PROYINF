const User = require('../../src/models/userModel.js');

async function login(req, res) {
    const { username, password } = req.body;
    console.log('Intentando iniciar sesión para:', username);

    try {
        // Busca al usuario en la base de datos
        const user = await User.getUserByUsername(username);
        
        if (user) {
            console.log('Usuario encontrado:', user);

            // Verifica que la contraseña sea correcta (sin encriptación)
            if (password === user.password) {
                // Guarda el rol en la sesión
                req.session.user = { id: user.id, role: user.role };
                
                // Devuelve el rol como respuesta
                res.send(user.role);
            } else {
                console.log('Contraseña incorrecta');
                res.status(401).send('Credenciales incorrectas');
            }
        } else {
            console.log('Usuario no encontrado');
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
}

module.exports = { login };