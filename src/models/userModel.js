const db = require('../config/db');  // Asegúrate de que la ruta esté correcta
const bcrypt = require('bcrypt');

// Función para crear un usuario
async function createUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db('users').insert({
        username,
        password: hashedPassword,
        role
    });
}

// Función para obtener un usuario por su nombre de usuario
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

// Función para comparar contraseñas
const comparePassword = async (password, hashedPassword) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    } catch (error) {
        console.error('Error al comparar contraseña:', error);
        throw error;
    }
};

// Exportación de todas las funciones necesarias
module.exports = {
    createUser,
    getUserByUsername,
    comparePassword
};
