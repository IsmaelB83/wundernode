'use strict';
// Node imports
const express = require('express');
const { query, param, body } = require('express-validator');
// Own imports
const { UserCtrl } = require('../controllers');


module.exports = () => {

    const router = express.Router();

    // Cuentas existentes (sólo desarrollo)
    if (process.env.NODE_ENV || 'dev') {
        router.get('/', UserCtrl.list);
    }
    // Nueva cuenta de usuario y activación vía token recibido en el mail indicado
    router.post('/', [
        body('name').isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
        body('email').isLength({min:3, max: 150}).withMessage('debe estar entre 3 y 150 carácteres'),
        body('password').isLength({min:8, max: 12}).withMessage('debe estar entre 8 y 16 carácteres'),
    ], UserCtrl.create);
    router.get('/activate/:token', UserCtrl.activate);
    // Solicitud de reseteo (envía un mail con el token), y reseteo de la contraseña en firme
    router.post('/reset/', UserCtrl.resetRequest);
    router.post('/reset/:token', [
        body('email').isLength({min:3, max: 150}).withMessage('debe estar entre 3 y 150 carácteres'),
        body('password').isLength({min:8, max: 12}).withMessage('debe estar entre 8 y 16 carácteres'),
    ], UserCtrl.reset);
    // User login
    router.post('/login/', [
        body('email').isLength({min:3, max: 150}).withMessage('debe estar entre 3 y 150 carácteres'),
        body('password').isLength({min:8, max: 12}).withMessage('debe estar entre 8 y 16 carácteres'),
    ], UserCtrl.login);

    return router;
}
