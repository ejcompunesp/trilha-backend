const express = require('express');
const UserController = require('./controllers/UserController');
const auth = require('./middleware/auth');

const routes = express.Router();

routes.get('/', (req, res) => res.status(200).json('Api da trilha de backend'));

routes.get('/users', auth, UserController.listAll);
routes.post('/user', UserController.save);
routes.post('/login', UserController.login);
routes.put('/user', auth, UserController.update);
routes.delete('/user', auth, UserController.delete);

module.exports = routes;