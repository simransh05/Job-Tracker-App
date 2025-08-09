const { addJob } = require('../model/Job');
const createDBConnection = require('../config/db')

module.exports.getAddJob = (req, res) => {
  res.render('add-job');
};

module.exports.postAddJob = async (req, res) => {
  const userId = req.session.user.id;
  const {
    company,
    position,
    location,
    job_type,
    application_date,
    notes
  } = req.body;

  try {
    await addJob({
      user_id: userId,
      company,
      position,
      location,
      job_type,
      application_date,
      notes
    });
    res.redirect('/profile');
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getAllJobs = async (req, res) => {
  try {
    const db = await createDBConnection();
    const [rows] = await db.execute(`
      SELECT jobs.*, users.username AS username
      FROM jobs
      JOIN users ON jobs.user_id = users.user_id
      ORDER BY jobs.application_date DESC
    `);
    res.render('allJobs', { jobs: rows });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.renderFilterForm = (req, res) => {
  if (!req.session.history) req.session.history = [];
  res.render('filterJobs', { history: req.session.history });
};

module.exports.handleFilter = async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.redirect('/jobs/filter');
  }

  try {
    const db = await createDBConnection();

    const allowedKeys = ['company', 'position', 'job_type', 'location'];
    if (!allowedKeys.includes(key)) {
      return res.status(400).send("Invalid filter key");
    }

    const query = `SELECT * FROM jobs WHERE ${key} = ?`;
    const [jobs] = await db.execute(query, [value]);

    if (!req.session.history) req.session.history = [];

    const alreadyExists = req.session.history.some(
      entry => entry.key === key && entry.value === value
    );

    if (!alreadyExists) {
      req.session.history.push({ key, value, id: Date.now().toString() });
    }

    res.render('filteredJobs', { jobs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching filtered jobs");
  }
};

module.exports.deleteHistoryEntry = (req, res) => {
  const { historyId } = req.body;
  if (!req.session.history) req.session.history = [];

  req.session.history = req.session.history.filter(
    entry => entry.id !== historyId
  );

  res.redirect('/jobs/filter');
};
