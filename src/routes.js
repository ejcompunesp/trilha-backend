const express = require('express');
const BrandController = require('./controllers/BrandController');
const UserController = require('./controllers/UserController');
const auth = require('./middleware/auth');
const multer = require('multer');
const multerConfig = require('./middleware/multerConfig');
const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/', (req, res) => res.status(200).json('Api da trilha de backend'));

routes.get('/users', auth, UserController.listAll);
routes.post('/user', UserController.save);
routes.post('/login', UserController.login);
routes.put('/user', auth, UserController.update);
routes.delete('/user', auth, UserController.delete);

routes.get('/brand', BrandController.listAll);
routes.post('/brand', auth, BrandController.save);
routes.put('/brand/:id', auth, BrandController.update);
routes.delete('/brand/:id', auth, BrandController.delete);

routes.get('/product', ProductController.query);
routes.post('/product', auth, multer(multerConfig).single('image'), ProductController.save);
routes.put('/product/:id', auth, multer(multerConfig).single('image'), ProductController.update);
routes.delete('/product/:id', auth, ProductController.delete);

module.exports = routes;