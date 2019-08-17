"use strict";
// Node imports
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
// Own imports
const { user, task, tasklist } = require('./routes/index');
const { passport } = require('./config');
const { Error } = require('./middlewares');


module.exports = function(app) {

    // Settings
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, './views'));

    // Static files
    app.use('/public/', express.static('public'));

    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(flash());
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    // Routers
    app.use('/users', user());
    app.use('/tasks', task());
    app.use('/tasklists', tasklist());
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
    // error handler
    app.use(Error);
    return app;
};