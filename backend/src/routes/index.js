const express = require('express');
const { UserCtrl, TaskCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    router.get('/task/all', TaskCtrl.all);
    router.get('/task/:id', TaskCtrl.getById);
    router.post('/task/', TaskCtrl.create);
    router.put('/task/:id', TaskCtrl.updateById);
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