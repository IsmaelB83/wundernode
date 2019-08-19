"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskListCtrl } = require('../controllers');
const { Auth } = require('../middlewares');


module.exports = () => {
    const router = express.Router();
    router.get('/', Auth, TaskListCtrl.list);
    router.get('/:id', Auth, TaskListCtrl.get);
    router.post('/', Auth, TaskListCtrl.create);
    router.put('/:id', Auth, TaskListCtrl.update);
    return router;
}