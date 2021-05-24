const express = require('express');

const routes = express.Router();

routes.get('/', (req, res) => res.status(200).json('Api da trilha de backend'));

module.exports = routes;