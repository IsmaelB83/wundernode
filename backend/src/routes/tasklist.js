"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskListCtrl } = require('../controllers');
const authorize = require('../middlewares/auth');

module.exports = () => {
    const router = express.Router();
    // Rutas de tasklists
    router.get('/', authorize, TaskListCtrl.all);
    router.get('/:id', TaskListCtrl.getById);
    router.post('/', authorize, TaskListCtrl.create);
    router.put('/:id', authorize, TaskListCtrl.updateById);
    return router;
}