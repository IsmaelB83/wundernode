"use strict";
// Node imports
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Own imports
const Task = require('./task');
const { Log } = require('../utils');


// TaskList
const TaskListSchema = new Schema(
    {   
        description: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [Task],
        __v: { type: Number, select: false}
    },
    {
        timestamps: true,
    }
);

/**
* Función estática para listar anuncios de la base de datos
* @param {String} id Para filtrado por id
* @param {String} description Para filtrado por descripción
* @param {String} owner Para filtrado por tasklists de un propietario concreto
* @param {String} members Para filtrado por tasklists de un miembro concreto
* @param {Number} limit Para limitar el número de resultados a obtener
* @param {Number} skip Para saltar (paginar) los resultados obtenidos
* @param {Boolean} fields Para indicar los campos a obtener
* @param {Function} callback Función a llamar al terminar la consulta
*/
TaskListSchema.statics.list = function(description, owner, members, limit, skip, fields, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (description) filter.description = { '$regex': `^${description}`, '$options': 'i' };
        if (owner) filter.owner = owner;
        if (members) filter.members = members;
        // Preparo la query
        let queryDB = TaskList.find(filter)
            .populate('members', '-avatar -password -token -createdAt -updatedAt')
            .populate('owner', '-avatar -password -token -createdAt -updatedAt');
        queryDB.limit(limit);
        queryDB.skip(skip);
        queryDB.select(fields);
        queryDB.sort({ createdAt: 1 })
        // Query
        queryDB.exec(callback);        
    } catch (error) {
        Log.fatal('Error ejecutando consulta.');
        Log.fatal(error); 
        callback(error);
    }
}

/**
* Función estática para insertar una lista de tareas
* @param {Array} taskList Lista de tareas a crear
*/
TaskListSchema.statics.insert = async function(taskList) {
    try {
        return await taskList.save();
    } catch (error) {
        Log.fatal('Error insertando taskList.');
        Log.fatal(error);
    }
};

/**
* Función estática para actualizar los datos de una task list
* @param {ObjectId} id ID que representa a una task list en MongoDB
* @param {TaskList} newTaskList Objeto con los datos a modificar
*/
TaskListSchema.statics.updateTaskList = async function(id, newTaskList) {
    try {
        let oldTaskList = await oldTaskList.findById(id);
        if (oldTaskList) {
            oldTaskList.description = newTaskList.description || oldTaskList.description;
            oldTaskList.due = newTaskList.due || oldTaskList.due;
            oldTaskList.members = newTaskList.members || oldTaskList.members;
            oldTaskList.reminder = newTaskList.reminder || oldTaskList.reminder;
            oldTaskList.starred = newTaskList.starred || oldTaskList.starred;
            oldTaskList.completed = newTaskList.completed || oldTaskList.completed;
            oldTaskList.tasks = newTaskList.tasks || oldTaskList.tasks;
            return await oldTaskList.save();
        }
        return false;
    } catch (error) {
        Log.fatal('Error insertando anuncio.');
        Log.fatal(error);
    }
};

/**
* Función estática para eliminar todas las listas de tareas
*/
TaskListSchema.statics.deleteAll = async function() {
    try {
        await TaskList.deleteMany({});
    } catch (error) {
        Log.fatal('Error eliminando listas de tareas.');
        Log.fatal(error);
    }
};

const TaskList = mongoose.model('TaskList', TaskListSchema);
module.exports = TaskList;