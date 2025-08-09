const bcrypt = require('bcrypt');
const { findUserByUsername } = require('../model/user');

module.exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await findUserByUsername(username); 

        if (!user) {
            return res.redirect('/signup')
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect password');
        }

        req.session.user = { id: user.user_id, username: user.username };
        res.redirect('/profile');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.getLogin = (req, res) => {
    res.render('login'); 
};

