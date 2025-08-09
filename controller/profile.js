const { getUserJobs } = require('../model/Job');

module.exports.getProfile =  async (req, res) => {
  const user = req.session.user;

  const jobs = await getUserJobs(user.id); 

  res.render('profile', { user, jobs ,showLogout: true});
};