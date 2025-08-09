const createDBConnection = require('../config/db');

module.exports.getEdit = async (req, res) => {
  const jobId = req.params.id;
  const db = await createDBConnection();
  const [rows] = await db.execute('SELECT * FROM jobs WHERE job_id = ?', [jobId]);

  if (rows.length === 0) {
    return res.status(404).send("Job not found");
  }

  const job = rows[0];
  if (job.application_date instanceof Date) {
    job.application_date = job.application_date.toISOString().split('T')[0];
  }

  res.render('editJob', { job });
};

module.exports.postEdit = async (req, res) => {
  const jobId = req.body.jobId;
  const userId = req.session.user?.id;

  const { company, position, location, job_type, application_date, notes } = req.body;

  try {
    const db = await createDBConnection();
    await db.query(`
      UPDATE jobs
      SET company = ?, position = ?, location = ?, job_type = ?, application_date = ?, notes = ?
      WHERE job_id = ? AND user_id = ?
    `, [company, position, location, job_type, application_date, notes, jobId, userId]);

    res.redirect('/profile');
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send("Failed to update job.");
  }
};

module.exports.postDelete = async (req, res) => {
  const jobId = req.body.jobId;
  const db = await createDBConnection();

  try {
    await db.execute('DELETE FROM jobs WHERE job_id = ?', [jobId]);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting job");
  }
};

module.exports.applyJob = async (req, res) => {
  const { job_id } = req.body;
  const user_id = req.session.user.id;

  try {
    const db = await createDBConnection();
    await db.execute(
      `INSERT INTO applied_jobs (user_id, job_id) VALUES (?, ?)`,
      [user_id, job_id]
    );
    res.redirect('/jobs/all');
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).send('Failed to apply for job.');
  }
};

module.exports.getAppliedJobs = async (req, res) => {
  const user_id = req.session.user.id;

  try {
    const db = await createDBConnection();
    const [jobs] = await db.execute(`
      SELECT jobs.* FROM applied_jobs
      JOIN jobs ON applied_jobs.job_id = jobs.job_id
      WHERE applied_jobs.user_id = ?
      ORDER BY applied_jobs.applied_at DESC
    `, [user_id]);

    res.render('appliedJobs', { jobs });
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).send('Error loading applied jobs');
  }
};

module.exports.deleteAppliedJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.session.user?.id;

  try {
    const db = await createDBConnection();
    await db.execute('DELETE FROM applied_jobs WHERE user_id = ? AND job_id = ?', [userId, jobId]);
    res.redirect('/applied-jobs');
  } catch (error) {
    console.error("Error deleting applied job:", error);
    res.status(500).send("Failed to delete applied job.");
  }
};

module.exports.deleteFilterFromHistory = (req, res) => {
  const { field, value } = req.body;

  if (req.session.filterHistory) {
    req.session.filterHistory = req.session.filterHistory.filter(
      f => !(f.field === field && f.value === value)
    );
  }

  res.redirect('/job/filter/results');
};
