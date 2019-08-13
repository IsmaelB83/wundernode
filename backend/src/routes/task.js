"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    // Rutas de tasks
    router.get('/:id', TaskCtrl.all);
    router.post('/', TaskCtrl.create);
    router.put('/:id', TaskCtrl.modify);

    return router;
}