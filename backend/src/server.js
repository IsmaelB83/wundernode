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
const router = require('./routes/index');
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
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(flash());
    app.use(cors());
    app.use(cookieParser());
    app.use(session({
        secret: 'secret-key',
        reserve: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Asignar variables locales al response
    app.use((req, res, next) => {
        res.locals.vardump = vardump;
        res.locals.messages = req.flash();
        res.locals.user = {...req.user};
        next();
    });

    // Routers
    app.use('/', router());

    return app;
};