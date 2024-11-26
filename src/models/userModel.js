const db = require('../config/db');  // Asegúrate de que la ruta esté correcta

async function getUserByUsername(username) {
    try {
        // Usar Knex para realizar la consulta
        const user = await db('users').where('username', username).first(); // `.first()` para obtener solo el primer resultado

        return user;  // Retorna el usuario encontrado
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;  // Lanza el error para que sea manejado por el bloque catch en login
    }
}

module.exports = { getUserByUsername };
