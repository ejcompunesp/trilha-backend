const sequelize = require('sequelize');
const dbConfig = require('./config/database');

const connection = new sequelize(dbConfig);

module.exports = connection;