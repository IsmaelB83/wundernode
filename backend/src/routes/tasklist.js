"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskListCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    // Rutas de tasklists
    router.get('/', TaskListCtrl.all);
    router.get('/:id', TaskListCtrl.getById);
    router.post('/', TaskListCtrl.create);
    router.put('/:id', TaskListCtrl.updateById);
    return router;
}