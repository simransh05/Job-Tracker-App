const { createUser, findUserByUsername } = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.postSignup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.redirect('/login');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await createUser(username, hashedPassword);
    res.redirect('/login');
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getSignup = (req, res, next) => {
  res.render('signup');
}