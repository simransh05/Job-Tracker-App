const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const createDBConnection = require('../config/db');

dotenv.config();

// Local Strategy
passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const db = await createDBConnection();
      const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      const user = users[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI
},
  async function (accessToken, refreshToken, profile, cb) {
    try {
      const db = await createDBConnection();
      const [users] = await db.execute('SELECT * FROM users WHERE googleId = ?', [profile.id]);
      let user = users[0];

      if (user) {
        return cb(null, user);
      }

      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (username, googleId, googleAccessToken) VALUES (?, ?, ?)',
        [profile.displayName, profile.id, accessToken]
      );

      const insertedUserId = result.insertId;
      const [newUserRows] = await db.execute('SELECT * FROM users WHERE id = ?', [insertedUserId]);

      return cb(null, newUserRows[0]);
    } catch (err) {
      cb(err, false);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const db = await createDBConnection();
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
