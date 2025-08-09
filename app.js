const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./Auth/passport');
const { createUserTable } = require('./model/user');
const { createJobTable } = require('./model/Job');
const {createApplicationTable} = require('./model/application')
const createDBConnection = require('./config/db');
require('dotenv').config();
hbs.registerPartials(__dirname + '/views/partials');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(session({
  key: 'session_cookie_name',
  secret: 'secret_key_here',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile');
  }
);

const signUpRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
app.use('/signup', signUpRoute);
app.use('/login', loginRoute);
const profileRoute = require('./routes/profile');
app.use('/profile', profileRoute)
const jobRoutes = require('./routes/job');
app.use('/jobs', jobRoutes);
const jobRoutesFilter = require('./routes/jobRoutes');
app.use('/',jobRoutesFilter)

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  return res.redirect('/login');
});

app.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Something went wrong during logout.");
    }
    res.redirect('/login'); 
  });
});

  (async () => {
    try {
      await createUserTable();
      await createJobTable();
      await createApplicationTable();

      const PORT = 4000;
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });

    } catch (error) {
      console.error("Startup error:", error);
    }
  })();
