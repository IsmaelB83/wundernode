"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskListCtrl } = require('../controllers');
const { Auth } = require('../middlewares');

module.exports = () => {
    const router = express.Router();
    // Rutas de tasklists
    router.get('/', Auth, TaskListCtrl.all);
    router.get('/:id', Auth, TaskListCtrl.getById);
    router.post('/', Auth, TaskListCtrl.create);
    router.put('/:id', Auth, TaskListCtrl.updateById);
    return router;
}