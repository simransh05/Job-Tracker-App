const express = require('express');
const router = express.Router();
const controller = require('../controller/jobController');
const middleware = require('../middleware/isLoggedIn')

router.get('/edit/:id', controller.getEdit);

router.post('/edit/:id', controller.postEdit);

router.post('/delete',controller.postDelete);

router.post('/apply-job', middleware.ensureAuthenticated, controller.applyJob);

router.get('/applied-jobs', controller.getAppliedJobs);

router.post('/applied-jobs/delete', controller.deleteAppliedJob);

router.post('/history/delete', controller.deleteFilterFromHistory);

module.exports = router;
