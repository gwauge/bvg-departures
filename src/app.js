// import modules
const express = require('express');
const routes = require('./routes');

// set up application
app = express();

// use middleware
// set templating engine
app.set('views', 'src/static');
app.set('view engine', 'pug');

// use middleware to handle incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' })); // limit incoming files to 1mb

// Static pages
app.use(express.static('src/static/public'));
app.use('/departures', express.static('src/static/departure'));

// Routes
app.use('', routes);

module.exports = app;