// Node imports
const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const { validationResult } = require('express-validator');
// Own imports
const { User, TaskList } = require('../models');
const { mail } = require('../utils');

const ctrl = {};


ctrl.create = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Creación del usuario
        let user = await User.insert(new User({...req.body}));
        if (user) {
            // Creo las listas por defecto del usuario
            let result = await TaskList.insertSystemTaskLists(user.id);
            if (result) {
                // Ok
                res.status(201).json({
                    success: true,
                    description: 'User created successfully',
                    result: user
                });
                return;
            }
        }
        // Error
        next('Error creando usuario');
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.sendToken = async (req, res, next) => {
    try {
        // Busco el usuario sobre el que están intentando restablecer su contraseña
        let user = await User.findOne({email: req.body.email });
        if (!user) {
            log.fatal(`Error`);
        }
        // Genero token, fecha de expiración y lo guardo todo en BD
        user.token = crypto.randomBytes(20).toString('hex');
        user.expire = Date.now() + 360000;
        user = await user.save();
        if (!user) {
            log.fatal(`Error`);
        }
        // Genero url de reseteo y la envío por mail
        const resetUrl = `http://${req.headers.host}/user/reset/${user.token}`;
        mail.send({
            email: user.email, 
            subject: 'Password reset',
            url: resetUrl,
            view: 'resetPassword'
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.resetWithToken = async (req, res, next) => {
    const user = await User.findOne({token: req.params.token});
    if (!user) {
        log.fatal(`Error`);
    }
    res.json(user);
}

ctrl.activateUser = async (req, res, next) => {
    let user = await User.findOne({token: req.params.token, active: false});
    if (!user) {
        log.fatal(`Error`);
    }
    user.token = '';
    user.expire = '';
    user.active = true;
    user = await user.save();
    if (!user) {
        log.fatal(`Error`);
    }
    res.json({status: 'ok'});
}

ctrl.updatePassword = async (req, res, next) => {
    const user = await User.findOne({token: req.params.token});
    if (!user) {
        res.json({status: 'ok'});
    }
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expire = null;
    await user.save();
    res.json({status: 'ok'});
}

ctrl.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login/',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

ctrl.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/user/login/');
    });
}

ctrl.userAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user/login/');
}

module.exports = ctrl;