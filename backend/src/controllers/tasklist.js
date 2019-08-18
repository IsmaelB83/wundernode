"use strict";
// Node imports
const moment = require('moment');
// Own imports
const { TaskList, Task, User } = require('../models');
const Log = require('../utils/log');

moment.updateLocale('en', { week : { dow : 1, doy : 4 } } );

const ctrl = {};

/**
 * Obtiene el listado de tasklists de un usuario concreto
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.list = async (req, res, next) => {
    try {
        // Listado
        TaskList.list(req.query.description, req.query.owner, req.user.id, parseInt(req.query.limit), 
            parseInt(req.query.skip), req.query.fields, function(error, results) {
                // Error
                if (error) {
                    return next(error);
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
 * Crea una nueva tarea para el usuario logueado actualmente
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.create = async (req, res, next) => {
    try {
        let taskList = new TaskList({...req.body});
        taskList.members.push(req.user.id);
        taskList.owner = req.user.id;
        await taskList.save();
        res.json({
            success: true,
            result: taskList
        });
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Obtiene una lista de tareas en base a su id. Sólo devuelve la información en caso
 * de que seas miembro de esa lista.
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.getById = async (req, res, next) => {
    try {
        const result = await TaskList.findById(req.params.id);
        if (result) {
            const i = result.members.indexOf(req.user.id);
            if (i !== -1) {
                return res.json({
                    success: true,
                    result: result
                });
            }
            return next({status: 401, description: 'Tasklist not authorized'});
        }
        next ({status: 404, description: 'Not found'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

/**
 * Actualiza el listao de tareas sólo en caso de que el usuario logueado
 * sea miembro de la lista
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.updateById = async (req, res, next) => {
    try {
        let result = await TaskList.findOne({_id: req.params.id});
        if (result) {
            const i = result.members.indexOf(req.user.id);
            if (i !== -1) {
                result.description = req.body.description || result.description;
                result.members = req.body.members || result.members;
                result = await result.save();
                return res.json({
                    success: true, 
                    result: result
                });
            }
            return next({status: 401, description: 'Tasklist not authorized'});
        }
        next({
            status: 404,
            description: 'Tasklist not found',
        });
        
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

module.exports = ctrl;