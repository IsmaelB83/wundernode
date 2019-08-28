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
                        data: `Tasklist ${req.query.taskList} not found`
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
        next({status: 500, data: error});
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
        return next({status: 404, data: 'Not found'});        
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next({data: error});
    }
}

/**
 * Crea una tarea
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.create = async (req, res, next) => {
    try {
        // Añado un task a la lista indicada
        const task = { description: req.body.description, starred: req.body.starred };
        const result = await TaskList.findOneAndUpdate(
            { _id: req.body.id, 'members': req.user.id },
            { $push: { tasks: task } },
            { new: true }
        );
        if (result) {
            return res.json({
                success: true,
                result: result.tasks.pop()
            });   
        }
        return next({status: 404, data: 'Not found'});    
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next({data: error});
    }
}

/**
 * Marca como completada una task
 */
ctrl.complete = async (req, res, next) => {
    try {
        // Busco la task y la actualizo (siempre y cuando el usuario sea miembro de la lista)
        const result = await TaskList.updateOne(
            { 'tasks._id': req.params.id, 'members': req.user.id },
            { $set: { 'tasks.$.completed': req.body.completed,
                      'tasks.$.closedAt': Date.now(),
                      'tasks.$.closedBy': req.user.id,
                    }  
            }
        );
        if (result) {
            return res.json({
                success: true,
                result: result
            });   
        }
        return next({status: 404, data: 'Not found'});    
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next({description: error});
    }
}

/**
 * Marca como starred una task
 */
ctrl.star = async (req, res, next) => {
    try {
        // Busco la task y la actualizo (siempre y cuando el usuario sea miembro de la lista)
        const result = await TaskList.updateOne(
            { 'tasks._id': req.params.id, 'members': req.user.id },
            { $set: { 'tasks.$.starred': req.body.starred }  }
        );
        if (result) {
            return res.json({
                success: true,
                result: result
            });   
        }
        return next({status: 404, data: 'Not found'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next({description: error});
    }
}

/**
 * Actualiza una tarea
 */
ctrl.update = async (req, res, next) => {
    try {
        // Busco la task y la actualizo (siempre y cuando el usuario sea miembro de la lista)
        const result = await TaskList.update(
            { 'tasks._id': req.params.id, 'members': req.user.id },
            { $set: { 'tasks.$.starred': req.body.starred }  }
        );
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
            return next({data: 'Error actualizando task'});
        }
        // No encontrado o sin permisos
        return next({status: 404, data: 'Not found'});    

        
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next({data: error});
    }
}

module.exports = ctrl;