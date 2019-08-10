'use strict';
// Node imports
const express = require('express');
const { query, param, body } = require('express-validator');
// Own imports
const { UserCtrl } = require('../controllers');


module.exports = () => {
    const router = express.Router();
    // Rutas de cuentas de usuario
    router.post('/', [
        body('name').optional().isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
    ], UserCtrl.create);
    router.post('/reset/', UserCtrl.sendToken);
    router.get('/reset/:token', UserCtrl.resetWithToken);
    router.get('/new/:token', UserCtrl.activateUser);
    router.post('/reset/:token', UserCtrl.updatePassword);
    router.post('/login/', UserCtrl.login);
    router.get('/logout/', 
        UserCtrl.userAuthenticated,
        UserCtrl.logout
    )
    return router;
}