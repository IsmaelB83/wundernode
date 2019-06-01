// Node imports
const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
// Own imports
const { User, TaskList } = require('../models');
const { mail } = require('../utils');

const ctrl = {};

ctrl.create = async (req, res, next) => {
    try {
        let user = {...req.body};  
        user.token = crypto.randomBytes(20).toString('hex');
        user = await User.create(user);  
        if (!user) {
            res.json({
                status: 'error',
                description: 'Error creando usuario',
                result: user
            });
        }
        // Creando listas de tareas por defecto
        let taskList = {
            description: 'Inbox',
            members: user,
            active: true,
            icon: 'fas fa-inbox',
            color: 'blue',
            system: true,
            systemId: 0,
        }
        await TaskList.create(taskList);
        taskList.description = 'Starred';
        taskList.icon = 'far fa-star';
        taskList.color = 'red';
        taskList.systemId++;
        await TaskList.create(taskList);
        taskList.description = 'Today';
        taskList.icon = 'far fa-calendar-minus';
        taskList.color = 'green';
        taskList.systemId++;
        await TaskList.create(taskList);
        taskList.description = 'Week';
        taskList.icon = 'far fa-calendar-alt';
        taskList.color = 'orange';
        taskList.systemId++;
        await TaskList.create(taskList);
        // Genero url de reseteo y la envío por mail
        /*const resetUrl = `http://${req.headers.host}/user/new/${user.token}`;
        mail.send({
            email: user.email, 
            subject: 'Activar cuenta de usuario',
            url: resetUrl,
            view: 'newUser'
        });*/
        res.json({
            status: 'ok',
            description: 'Usuario creado con éxito',
            result: user
        })
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