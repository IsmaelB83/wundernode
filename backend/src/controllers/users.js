// Node imports
const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
// Own imports
const { User } = require('../models');
const { mail } = require('../utils');

const ctrl = {};

ctrl.create = async (req, res, next) => {
    try {
        let user = {...req.body};  
        user.token = crypto.randomBytes(20).toString('hex');
        user = await User.create(user);  
        if (!user) {
            return next();
        }
        // Genero url de reseteo y la envío por mail
        const resetUrl = `http://${req.headers.host}/user/new/${user.token}`;
        mail.send({
            email: user.email, 
            subject: 'Activar cuenta de usuario',
            url: resetUrl,
            view: 'newUser'
        });
        req.flash('correcto', 'Se le ha enviado un mail con el enlace para activar su usuario');
        res.redirect('/user/login/');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('user/newuser', {
            nombrePagina: 'New User',
            messages: req.flash(),
            email: req.body.email,
            password: req.body.password
        });
    }
}

ctrl.sendToken = async (req, res, next) => {
    try {
        // Busco el usuario sobre el que están intentando restablecer su contraseña
        let user = await User.findOne({ where: { email: req.body.email }});
        if (!user) {
            req.flash('error', 'Usuario no encontrado');
            res.redirect('/user/reset');
        }
        // Genero token, fecha de expiración y lo guardo todo en BD
        user.token = crypto.randomBytes(20).toString('hex');
        user.expire = Date.now() + 360000;
        user = await user.save();
        if (!user) {
            req.flash('error', 'Error generando token para restablecer contraseña');
            res.redirect('/user/reset');
        }
        // Genero url de reseteo y la envío por mail
        const resetUrl = `http://${req.headers.host}/user/reset/${user.token}`;
        mail.send({
            email: user.email, 
            subject: 'Password reset',
            url: resetUrl,
            view: 'resetPassword'
        });
        req.flash('correcto', 'Se le ha enviado un mail con el enlace para restablecer el password');
        res.redirect('/user/reset');
    } catch (error) {
        req.flash('error', `Error incontrolado ${error.toString}`);
        res.render('user/reset', {
            nombrePagina: 'Reset password',
            messages: req.flash(),
            email: req.body.email,
        });
    }
}

ctrl.resetWithToken = async (req, res, next) => {
    //res.json(req.params.token);
    const user = await User.findOne({where: {token: req.params.token}});
    if (!user) {
        req.flash('error', 'Token no encontrado');
        res.redirect('/user/reset');
    }
    res.render('user/resetPassword', {
        nombrePagina: 'Resetear password'
    })
    res.json(user);
}

ctrl.activateUser = async (req, res, next) => {
    let user = await User.findOne(
        {   where: 
            {   token: req.params.token,
                active: false
            }
        }
    );
    if (!user) {
        req.flash('error', 'Cuenta de usuario no encontrada');
        res.redirect('/user/login');
    }
    user.token = null;
    user.expire = null;
    user.active = true;
    user = await user.save();
    if (!user) {
        req.flash('error', 'Error intentando activar tu cuenta');  
        res.redirect('/user/login');
    }
    req.flash('correcto', 'Tu cuenta ha sido activada con con éxito');  
    res.redirect('/user/login');
}

ctrl.updatePassword = async (req, res, next) => {
    const user = await User.findOne(
        {   where: 
            {   token: req.params.token,
                expire: {
                    [Op.gte]: Date.now()
                }
            }
        }
    );
    if (!user) {
        req.flash('error', 'Token no encontrado o expirado');
        res.redirect('/user/reset');
    }
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expire = null;
    await user.save();
    req.flash('correcto', 'Tu password se ha restablecido con éxito');  
    res.redirect('/user/login');
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