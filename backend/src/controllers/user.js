"use strict";
// Node imports
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Own imports
const { User, TaskList } = require('../models');
const { Mail, Log } = require('../utils');
const { config } = require('../config');

const ctrl = {};


/**
 * Hacer login en la API. Retorna un JWT.
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.login = async (req, res, next) => {
    try {
        debugger;
        const user = await User.findOne({email: req.body.email});
        if (user) {
            // Comparo los passwords
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // Creo el payload del y firmo el token
                const payload = {
                    user: user._id,
                    name: user.name,
                    email: user.email, 
                    expires: moment().add(14, 'days').unix()
                };
                const token = jwt.sign({payload}, config.secret_key);
                // Retorno el token al usuario
                return res.json({
                    success: true,
                    description: 'Authorization successful',
                    token: token,
                });
            } else {
                // No autorizado
                return next({status: 401, error: 'No autorizado'});
            }
        }
        // No autorizado
        next({status: 401, error: 'No autorizado'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);   
    }
}

/**
 * Listado de usuarios con filtros
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.list = async (req, res, next) => {
    try {
        // Listado
        User.list(req.query.name, req.query.email, req.query.active, req.query.token, parseInt(req.query.limit), 
            parseInt(req.query.skip), req.query.fields, function(error, results) {
                // Error
                if (error) {
                    next(error);
                    return;
                }
                // Ok
                res.json({
                    success: true,
                    count: results.length,
                    results: results
                });
        });
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Crear un nuevo usuario en la base de datos, y enviar mail para solicitar activación
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.create = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Creación del usuario
        let user = await User.insert(new User({...req.body}));
        if (user) {
            // Genero url de ativación de cuenta y la envío por mail
            const activateUrl = `http://${req.headers.host}/users/activate/${user.token}`;
            Mail.send({
                email: user.email, 
                subject: 'Activate account',
                url: activateUrl,
                view: 'new_user'
            });
            // Ok
            res.status(201).json({
                success: true,
                description: 'User created successfully. Check your email to activate account.',
            });
            return;
        }
        // Error
        next('Error creando usuario');
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Activar una cuenta previamente creada vía token
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.activate = async (req, res, next) => {
    try {
        let user = await User.findOne({
            token: req.params.token, 
            active: false, 
            expire: { $gt: Date.now()}
        });
        if (user) {
            // Activo el usuario
            user.token = '';
            user.expire = '';
            user.active = true;
            user = await user.save();
            // Creo las cuentas de sistema
            TaskList.insertSystemTaskLists(user.id);
            // Ok
            res.json({
                success: true,
                description: 'Cuenta de usuario activada con éxito.',
            });
            return;
        }
        // No autorizado
        next({status: 401, error: 'No autorizado'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Solicitar restablecimiento de contraseña. Envía un mail con el token.
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.resetRequest = async (req, res, next) => {
    try {
        // Busco el usuario sobre el que están intentando restablecer su contraseña
        let user = await User.findOne({email: req.body.email });
        if (user) {
            // Genero token, fecha de expiración y lo guardo todo en mongo
            user.token = crypto.randomBytes(20).toString('hex');
            user.expire = Date.now() + 360000;
            user = await user.save();
            // Genero url de reseteo y la envío por mail
            const resetUrl = `http://localhost:3000/reset/password/${user.token}`;
            Mail.send({
                email: user.email, 
                subject: 'Password reset',
                url: resetUrl,
                token: user.token.toLowerCase(),
                view: 'reset_password'
            });
            // Ok
            res.json({
                success: true,
                description: 'Check your email to change password.',
            });
            return;
        }
        // No autorizado
        next({status: 401, error: 'No autorizado'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Restablece la contraseña en caso de que el token recibido sea válido para el mail indicado.
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Siguiente middleware al que llamar
 */
ctrl.reset = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Busco por token válido e email
        const user = await User.findOne({
            token: req.params.token,
            email: req.body.email,
            expire: { $gt: Date.now() }
        });
        // Si existe actualizo el password y lo guardo
        if (user) {
            user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            user.token = null;
            user.expire = null;
            user.active = true;
            await user.save();
            // Ok
            res.json({
                success: true,
                description: 'Password updated successfully.',
            });
            return;
        }
        // No autorizado
        next({status: 401, error: 'No autorizado'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

module.exports = ctrl;