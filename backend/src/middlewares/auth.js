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
        // Sin cabecera de authorización error
        if (!req.headers.authorization) throw 'Forbidden';
        // Chequeo token
        req.token = req.headers.authorization.split(' ')[1];
        const token = jwt.decode(req.token, config.secret_key);
        if (token.payload.expires <= moment().unix()) throw 'Token expired';
        // Usuario autenticado, paso al siguiente controlador
        req.user = token.payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            description: `Not Authorized: ${error}`
        });
    }
};