const createDBConnection = require('../config/db');

async function createJobTable() {
  const db = await createDBConnection();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      job_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      company VARCHAR(100),
      position VARCHAR(100),
      location VARCHAR(100),
      job_type VARCHAR(50),
      application_date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.end();
}

async function addJob(jobData) {
  const {
    user_id,
    company,
    position,
    location,
    job_type,
    application_date,
    notes
  } = jobData;

  const db = await createDBConnection();
  const query = `
    INSERT INTO jobs 
    (user_id, company, position, location, job_type, application_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.execute(query, [
    user_id,
    company,
    position,
    location,
    job_type,
    application_date,
    notes || null
  ]);
  await db.end();
}

async function createJob(user_id, jobData) {
  const { company, position } = jobData;
  const db = await createDBConnection();
  const [result] = await db.execute(
    `INSERT INTO jobs (user_id, company, position, created_at)
     VALUES (?, ?, ?, NOW())`,
    [user_id, company, position]
  );
  await db.end();
  return result.insertId;
}

async function getUserJobs(userId) {
  const db = await createDBConnection();
  const [rows] = await db.execute('SELECT * FROM jobs WHERE user_id = ?', [userId]); 
  await db.end();
  return rows;
}

async function getJobById(user_id, job_id) {
  const db = await createDBConnection();
  const [rows] = await db.execute(
    `SELECT * FROM jobs WHERE job_id = ? AND user_id = ?`,
    [job_id, user_id]
  );
  await db.end();
  return rows[0];
}

async function updateJob(user_id, job_id, jobData) {
  const { company, position, location, job_type, application_date, notes } = jobData;
  const db = await createDBConnection();
  const [result] = await db.execute(
    `UPDATE jobs
     SET company = ?, position = ?, location = ?, job_type = ?, application_date = ?, notes = ?
     WHERE job_id = ? AND user_id = ?`,
    [company, position, location, job_type, application_date, notes || null, job_id, user_id]
  );
  await db.end();
  return result.affectedRows > 0;
}

async function deleteJob(user_id, job_id) {
  const db = await createDBConnection();
  const [result] = await db.execute(
    `DELETE FROM jobs WHERE job_id = ? AND user_id = ?`,
    [job_id, user_id]
  );
  await db.end();
  return result.affectedRows > 0;
}

async function getJobsByFilters(userId, { search, sort }) {
  let query = `SELECT * FROM jobs WHERE user_id = ?`;
  const values = [userId];

  if (search) {
    query += ` AND (company LIKE ? OR position LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at ${sort === 'asc' ? 'ASC' : 'DESC'}`;
  const db = await createDBConnection();
  const [rows] = await db.execute(query, values);
  await db.end();
  return rows;
}

module.exports = {
  createJobTable,
  getJobsByFilters,
  createJob,
  addJob,
  getUserJobs,
  getJobById,
  updateJob,
  deleteJob
};
