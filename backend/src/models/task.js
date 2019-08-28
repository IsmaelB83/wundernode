"use strict";
// Node imports
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId; 
const { Schema } = mongoose;
// Own imports
const { Log } = require('../utils');

// Task
const TaskSchema = new Schema(
    {  
        description: { type: String, maxlength: 200 },
        due: { type: Date },
        reminder: { type: Date },
        starred: { type: Boolean, default: false },
        completed: { type: Boolean, default: false },
        closedAt: { type: Date },
        closedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        __v: { type: Number, select: false}
    },
    {
        timestamps: true,
    }    
);

/**
* Función estática para listar tareas de la base de datos
* @param {String} taskList Para filtrado por lista de tareas asociada
* @param {String} description Para filtrado por tasks por descripción
* @param {Date} due Para filtrado por tasks con fecha de vencimiento
* @param {Date} reminder Para filtrado por con fecha de recordatorio
* @param {String} starred Para filtrado por tasks favoritas
* @param {String} user Para filtrado por tasks de un usuario
* @param {function} callback Función a llamar al terminar la consulta
*/
TaskSchema.statics.list = function(taskList, description, due, reminder, starred, user, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (taskList) filter.taskList = new ObjectId("5d5ac3ffc79b56153c637d46");
        if (description) filter.description = { '$regex': `^${description}`, '$options': 'i' };
        if (due) filter.due = due;
        if (reminder) filter.reminder = reminder;
        if (starred) filter.starred = starred;
        if (user) filter.user = user;
        // Preparo la query
        let queryDB = Task.find(filter);
        queryDB.limit(limit);
        queryDB.skip(skip);
        queryDB.select(fields);
        // Query
        queryDB.exec(callback);        
    } catch (error) {
        Log.fatal('Error ejecutando consulta.');
        callback(error);
    }
}

/**
* Función estática para insertar un task
* @param {Task} task Task a instertar en la base de datos 
*/
TaskSchema.statics.insert = async function(task) {
    try {
        return await task.save();
    } catch (error) {
        Log.fatal('Error insertando task.');
        Log.fatal(error);
    }
};

/**
* Función estática para actualizar los datos de una task
* @param {String} id ID que representa a una task en MongoDB
* @param {Task} newTask Objeto con los datos a modificar
*/
TaskSchema.statics.updateTask = async function(id, newTask) {
    try {
        let oldTask = await Task.findById(id);
        if (oldTask) {
            oldTask.taskList = newTask.taskList || oldTask.taskList;
            oldTask.description = newTask.description || oldTask.description;
            oldTask.due = newTask.due || oldTask.due;
            oldTask.reminder = newTask.reminder || oldTask.reminder;
            oldTask.starred = newTask.starred || oldTask.starred;
            oldTask.completed = newTask.completed || oldTask.completed;
            return await oldTask.save();
        }
        return false;
    } catch (error) {
        Log.fatal('Error insertando anuncio.');
        Log.fatal(error);
    }
};

/**
* Función estática para eliminar todos los usuarios
*/
TaskSchema.statics.deleteAll = async function() {
    try {
        await Task.deleteMany({});
    } catch (error) {
        Log.fatal('Error eliminando tareas.');
        Log.fatal(error);
    }
};

module.exports = TaskSchema;