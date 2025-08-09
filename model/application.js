const createDBConnection = require('../config/db');

async function createApplicationTable() {
    const db = await createDBConnection();
    await db.execute(`
    CREATE TABLE IF NOT EXISTS applied_jobs (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);
  `);
    await db.end();
}


module.exports = {
    createApplicationTable
}