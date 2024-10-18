const db = require('../config/db'); // Asegúrate de que la ruta sea correcta

const getUserByUsername = async (username) => {
    const result = await db('users').where({ username }).first(); // Usa la sintaxis de Knex
    return result;
};


module.exports = { getUserByUsername};