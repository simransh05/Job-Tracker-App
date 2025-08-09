const createDBConnection = require('../config/db');

async function createUserTable() {
    const db = await createDBConnection();
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (  
            user_id INT AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL
        );
    `);
    await db.end();
}

async function findUserByUsername(username) {
    const db = await createDBConnection();
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

async function getUserByUserId(user_id) {
    const db = await createDBConnection();
    const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
    await db.end();
    return rows[0];
}

async function createUser(username, password) {
    const db = await createDBConnection();
    const [result] = await db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password]
    );
    await db.end();
    return result.insertId;
}

module.exports = {
    createUserTable,
    findUserByUsername,
    createUser,
    getUserByUserId
};
