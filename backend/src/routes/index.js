const express = require('express');
const { UserCtrl, TaskListCtrl, TaskCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
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
    // Rutas de tasklists
    router.get('/tasklist/all', TaskListCtrl.all);
    router.get('/tasklist/:id', TaskListCtrl.getById);
    router.post('/tasklist/', TaskListCtrl.create);
    router.put('/tasklist/:id', TaskListCtrl.updateById);
    // Rutas de tasks
    router.get('/tasklist/task/:id', TaskCtrl.all);
    router.post('/tasklist/task/', TaskCtrl.create);

    return router;
}