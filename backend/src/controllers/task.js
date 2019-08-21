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
        // Busco la tasklist que contiene esa tarea, siempre y cuando el usuario sea miembro de la lista
        const result = await TaskList.findOne(
            { 'tasks._id': req.params.id, 'members': req.user.id },
            { 'tasks.$': 1 },
        );
        // Encontrado y con permisos
        if (result) {
            return res.json({
                success: true,
                result: result
            });
        }
        // No encontrado o sin permisos
        return next({status: 404, description: 'Not found'});        
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
        // Busco la tasklist que contiene esa tarea, siempre y cuando el usuario sea miembro de la lista
        const result = await TaskList.findOne(
            { 'tasks._id': req.params.id, 'members': req.user.id },
            { 'tasks.$': 1 },
        );
        // Encontrado y con permisos. Actualizo y reenvio.
        if (result) {
            result.tasks[0].description = req.body.description || result.tasks[0].description;
            result.tasks[0].due = req.body.due || result.tasks[0].due;
            result.tasks[0].reminder = req.body.reminder || result.tasks[0].reminder;
            result.tasks[0].starred = typeof(req.body.starred)!==undefined?req.body.starred:result.tasks[0].starred;
            result.tasks[0].completed = typeof(req.body.completed)!==undefined?req.body.completed:result.tasks[0].completed;
            const aux = await TaskList.update(result);
            if (aux.ok === 1) {
                return res.json({
                    success: true,
                    result: result
                });   
            }
            return next('Error actualizando task');
        }
        // No encontrado o sin permisos
        return next({status: 404, description: 'Not found'});    

        
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

module.exports = ctrl;