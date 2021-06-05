const express = require('express');
const path = require('path');
const routes = require('./routes');

require('dotenv').config();
require('./database');

const app = express();

app.use(express.json());
app.use(routes);
app.use('/images', express.static(path.resolve(__dirname, '..', 'uploads')));

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log("Running on port " + port);
});