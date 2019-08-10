// Node imports
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// Own imports
const { user, task, tasklist } = require('./routes/index');
const { passport } = require('./config');
const { vardump } = require('./utils/index');

module.exports = function(app) {

    // Settings
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, './views'));

    // Static files
    app.use(express.static('public'));

    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(flash());
    app.use(cors());
    app.use(cookieParser());
    app.use(session({
        secret: 'secret-key',
        resave: true,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
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
    app.use(function(error, req, res, next) {
        // Validation error
        if (error.array) { 
            error.status = 422;
            const errInfo = error.array({ onlyFirstError: true })[0];
            error.error = `No válido - ${errInfo.param} ${errInfo.msg}`;
        }
        // status 500 si no se indica lo contrario
        res.status(error.status || 500);
        res.json({
            success: false, 
            error: error
        });
    });
    return app;
};