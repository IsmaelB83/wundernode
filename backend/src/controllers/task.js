"use strict";
// Node imports
const moment = require('moment');
var mongoose = require('mongoose');

// Own imports
const { Task, TaskList, User } = require('../models');
const { Log } = require('../utils');


moment.updateLocale('en', { week : { dow : 1, doy : 4 } } );

const ctrl = {};

/**
 * Obtiene las tareas indicadas por los parametros de consulta
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.list = async (req, res, next) => {
    try {
        // Listado
        Task.list(req.query.taskList, req.query.description, req.query.due, req.query.reminder, 
            req.query.starred, req.user.id, function(error, results) {
                // Error
                if (error || !results.length) {
                    return next({
                        status: 404,
                        description: `Tasklist ${req.query.taskList} not found`
                    })
                }
                // Ok
                res.json({
                    success: true,
                    count: results.length,
                    results: results
                });
        });
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Obtiene una tarea a partir de su ID. Sólo devuelve información en caso de que seas miembro de la lista
 * asociada a dicha tarea
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.get = async (req, res, next) => {
    try {
        const result = await TaskList.find({"tasks._id": mongoose.Types.ObjectId(req.params.id)});
        if (result) {
            const i = result.taskList.members.indexOf(req.user.id);
            if (i !== -1) {
                return res.json({
                    success: true,
                    result: result
                });
            }
            return next({status: 401, description: 'Task not authorized'});
        }
        next ({status: 404, description: 'Not found'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Crea una tarea
 */
ctrl.create = async (req, res, next) => {
    try {
        let taskList = await TaskList.findById(req.body.id);
        if (!taskList || ( taskList.system && taskList.systemId !== 0)) {
            res.status(404).json({
                status: 'error', 
                description: 'Task list not found',
                result: {}
            });
            return ;
        }
        let task = new Task({...req.body});
        let user = await User.findOne({email: 'ismaelbernal83@gmail.com'});
        if (user) {
            task.owner = user;
        }
        task.taskList = taskList;
        taskList.tasks.push(task);
        if (task.starred) {
            taskList.starred.push(task);
        }
        task = await task.save();
        await taskList.save();
        taskList = await TaskList.findById(req.body.id);
        let tasks = await Task.find({taskList: taskList._id});
        res.json({status: 'ok', result: {taskList, tasks}});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Actualiza una tarea
 */
ctrl.update = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({
                status: 'error', 
                description: 'Task not found',
                result: {}
            });
            return ;
        }
        let oldStarred = task.starred;
        task.description = req.body.description?req.body.description:task.description;
        task.due = req.body.due?req.body.due:task.due;
        task.reminder = req.body.reminder?req.body.reminder:task.reminder;
        task.starred = req.body.starred;
        task.completed = req.body.completed;
        task = await task.save();
        let taskList = await TaskList.findById(task.taskList._id);
        if (taskList && oldStarred !== task.starred) {
            if (task.starred) taskList.starred.push(task);
            else taskList.starred.splice(taskList.starred.indexOf(task._id), 1 );
            await taskList.save();
        }
        let tasks = await Task.find({taskList: taskList._id});
        res.json({status: 'ok', result: {taskList, tasks}});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

module.exports = ctrl;