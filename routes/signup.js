const express = require('express')

const routes = express.Router();

const controller = require('../controller/signup');

routes.get('/',controller.getSignup);
routes.post('/',controller.postSignup);

module.exports = routes;