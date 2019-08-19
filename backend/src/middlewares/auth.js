"use strict";
// Node imports
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Own imports
const { config } = require('../config'); 
const { User } = require('../models/');

// Authorization
module.exports = (req, res, next) => {
    try {

        // DEV == Para poder testear sin necesidad de login
        User.findOne()
        .then((user) => {
            req.user =  user;
            next();  
        })
        .catch((error) => {
        });

        /* // Sin cabecera de authorización error
        if (!req.headers.authorization) throw 'Forbidden';
        // Chequeo token
        req.token = req.headers.authorization.split(' ')[1];
        const payload = jwt.decode(req.token, config.secret_key);
        if (payload.payload.expires <= moment().unix()) throw 'Token expired';
        // Usuario autenticado, paso al siguiente controlador
        req.user = payload.user;
        next(); */
    } catch (error) {
        return res.status(401).json({
            success: false,
            description: `Not Authorized: ${error}`
        });
    }
};