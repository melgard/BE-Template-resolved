const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')

// here we can call all versions available
const { v1 } = require('./routes/v1');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// here we van maintain retro-compatibility adding a new version without remove this
app.use('/v1', v1)

// eg: app.use('/vx', vx) ...

module.exports = app;
