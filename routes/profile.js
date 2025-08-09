const express = require('express')

const routes = express.Router();

const controller = require('../controller/profile');
const middleware = require('../middleware/isLoggedIn')

routes.get('/', middleware.ensureAuthenticated,controller.getProfile);

module.exports = routes;