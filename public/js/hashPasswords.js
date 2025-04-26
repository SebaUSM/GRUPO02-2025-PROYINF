const db = require('../../src/config/db');
const bcrypt = require('bcrypt');

async function hashExistingPasswords() {
    const users = await db('users');

    for (let user of users) {
        if (!user.password.startsWith('$2b$')) { // No está hasheada
            const hashed = await bcrypt.hash(user.password, 10);
            await db('users')
                .where({ id: user.id })
                .update({ password: hashed });
            console.log(`Contraseña del usuario ${user.username} encriptada`);
        }
    }

    
}

module.exports = hashExistingPasswords;
