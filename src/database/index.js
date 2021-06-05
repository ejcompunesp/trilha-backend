const sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

const connection = new sequelize(dbConfig);
connection.authenticate()
  .then(() => { console.log('Conexão criada') })
  .catch((error) => { console.log(error) });

User.init(connection);
Brand.init(connection);
Product.init(connection);

Brand.associate(connection.models);
Product.associate(connection.models);

module.exports = connection;