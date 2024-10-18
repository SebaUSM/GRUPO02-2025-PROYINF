const db = require('../models/userModel'); // Asegúrate de que esto esté correcto

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await db.getUserByUsername(username); // Usa la función correcta

    if (user && user.password === password) { 
        req.session.userId = user.id;
        req.session.role = user.role;
        return res.status(200).send(user.role);
    }

    return res.status(401).send('Credenciales inválidas');
};