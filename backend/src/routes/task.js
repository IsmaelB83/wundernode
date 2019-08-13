"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskCtrl } = require('../controllers');
const { Auth } = require('../middlewares');


module.exports = () => {
    const router = express.Router();
    // Rutas de tasks
    router.get('/:id', Auth, TaskCtrl.all);
    router.post('/', Auth, TaskCtrl.create);
    router.put('/:id', Auth, TaskCtrl.modify);

    return router;
}