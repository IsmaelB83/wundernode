"use strict";
// Node imports
const express = require('express');
// Own imports
const { TaskCtrl } = require('../controllers');
const { Auth } = require('../middlewares');


module.exports = () => {
    const router = express.Router();
    router.get('/', Auth, TaskCtrl.list);
    router.get('/:id', Auth, TaskCtrl.get);
    router.post('/', Auth, TaskCtrl.create);
    router.put('/:id/complete', Auth, TaskCtrl.complete);
    router.put('/:id/star', Auth, TaskCtrl.star);
    return router;
}