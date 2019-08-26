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
        TaskList.list(req.query.id, req.query.description, req.query.owner, req.user.id, parseInt(req.query.limit), 
            parseInt(req.query.skip), req.query.fields, function(error, results) {
                // Error
                if (error) {
                    return next(error);
                }
                // Ok
                return res.json({
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
 * Obtiene una lista de tareas en base a su id. Sólo devuelve la información en caso
 * de que seas miembro de esa lista.
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.get = async (req, res, next) => {
    try {
        // Listado
        TaskList.list(req.params.id, null, null, req.user.id, 1, 0, null, 
            function(error, result) {
                // Error
                if (error) {
                    return next(error);
                }
                // Ok
                res.json({
                    success: true,
                    result: result[0]
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
        const taskList = new TaskList();
        // Configuro la lista
        taskList.description = req.body.description;
        taskList.owner = req.user.id;
        taskList.members = [req.user.id]
        if (req.body.members) req.body.members.forEach(m => taskList.members.push(m.id));
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
 * Actualiza el lista de tareas sólo en caso de que el usuario logueado
 * sea miembro de la lista
 * @param {Request} req Request de la petición
 * @param {Response} res Response de la petición
 * @param {Middleware} next Siguiente middleware a ejecutar
 */
ctrl.update = async (req, res, next) => {
    try {
        // Añado los nuevos miembros a la lista
        const result = await TaskList.findOneAndUpdate(
            { _id: req.params.id, 'members': req.user.id },
            { $push: { members: req.body.members } },
            { new: true }
        );
        if (result) {
            return res.json({
                success: true, 
                result: result
            });
        }
        return next({status: 401, description: 'Tasklist not authorized'});
    } catch (error) {
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

module.exports = ctrl;