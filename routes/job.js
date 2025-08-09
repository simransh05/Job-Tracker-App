const express = require('express');
const router = express.Router();
const jobController = require('../controller/job');
const middleware = require('../middleware/isLoggedIn');

router.get('/add', middleware.ensureAuthenticated, jobController.getAddJob);

router.post('/add', middleware.ensureAuthenticated, jobController.postAddJob);

router.get('/all',middleware.ensureAuthenticated,jobController.getAllJobs);

router.get('/filter', jobController.renderFilterForm);

router.post('/filter', jobController.handleFilter);

router.post('/history/delete', jobController.deleteHistoryEntry);

module.exports = router;
