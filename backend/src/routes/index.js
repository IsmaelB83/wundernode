const express = require('express');
const { UserCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    router.get('/list', (req, res, next) => {
        res.json({
            name: 'Ismael Bernal',
            mail: 'ismaelbernal83@gmail.com'
        })
    });
    // Rutas de cuentas de usuario
    router.post('/user/', UserCtrl.create);
    router.post('/user/reset/', UserCtrl.sendToken);
    router.get('/user/reset/:token', UserCtrl.resetWithToken);
    router.get('/user/new/:token', UserCtrl.activateUser);
    router.post('/user/reset/:token', UserCtrl.updatePassword);
    router.post('/user/login/', UserCtrl.login);
    router.get('/user/logout/', 
        UserCtrl.userAuthenticated,
        UserCtrl.logout
    )

    return router;
}