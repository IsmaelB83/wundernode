"use strict";
// Node imports
const mongoose = require('mongoose');
const { Schema } = mongoose;

// TaskList
const TaskListSchema = new Schema(
    {   
        description: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        active: { type: Boolean, default: true },
        icon: { type: String },
        color: { type: String },
        system: { type: Boolean, default: false },
        systemId: { type: Number },
    },
    {
        timestamps: true,
    }
);

/**
* Función estática para listar anuncios de la base de datos
* @param {String} description Para filtrado por descripción
* @param {String} owner Para filtrado por tasklists de un propietario concreto
* @param {String} member Para filtrado por tasklists de un miembro concreto
* @param {Boolean} active Para filtrado por tasks favoritas
* @param {Boolean} system Para filtrado por tasks de un usuario
*/
TaskListSchema.statics.list = function(description, owner, member, active, system, limit, skip, fields, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (description) filter.description = { '$regex': `^${description}`, '$options': 'i' };
        if (owner) filter.owner = owner;
        if (member) filter.member = member;
        if (active) filter.active = active;
        if (system) filter.system = system;
        // Preparo la query
        let queryDB = TaskList.find(filter);
        queryDB.limit(limit);
        queryDB.skip(skip);
        queryDB.select(fields);
        // Query
        queryDB.exec(callback);        
    } catch (error) {
        log.fatal('Error ejecutando consulta.');
        log.fatal(error); 
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
        log.fatal('Error insertando taskList.');
        log.fatal(error);
    }
};

/**
* Función estática para insertar todas las task lists pasadas
* @param {Array} taskLists Listas de tareas a crear
*/
TaskListSchema.statics.insertAll = async function(taskLists) {
    try {
        return await TaskList.insertMany(taskLists);
    } catch (error) {
        log.fatal('Error insertando taskLists lists.');
        log.fatal(error);
    }
};

/**
* Función estática para crear las listas por defecto de un usuario: inbox, starred, today y week
* @param {ObjectId} owner Identificador del owner de las tareas
*/
TaskListSchema.statics.insertSystemTaskLists = async function(owner) {
    try {
        // Lista por defecto INBOX
        let taskList = {
            description: 'Inbox',
            owner: owner,
            members: [owner],
            icon: 'fas fa-inbox',
            color: 'blue',
            system: true,
            systemId: 0,
        };
        await TaskList.insert(new TaskList({...taskList}));
        // Lista por defecto STARRED
        taskList.description = 'Starred';
        taskList.icon = 'far fa-star';
        taskList.color = 'red';
        taskList.systemId++;
        await TaskList.insert(new TaskList({...taskList}));
        // Lista por defecto TODAY
        taskList.description = 'Today';
        taskList.icon = 'far fa-calendar-minus';
        taskList.color = 'green';
        taskList.systemId++;
        await TaskList.insert(new TaskList({...taskList}));
        // Lista por defecto WEEK
        taskList.description = 'Week';
        taskList.icon = 'far fa-calendar-alt';
        taskList.color = 'orange';
        taskList.systemId++;
        await TaskList.insert(new TaskList({...taskList}));
        // Ok
        return true;
    } catch (error) {
        log.fatal('Error insertando taskLists por defecto.');
        log.fatal(error);
    }
};

/**
* Función estática para actualizar los datos de una task list
* @param {String} id ID que representa a una task list en MongoDB
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
            return await oldTaskList.save();
        }
        return false;
    } catch (error) {
        log.fatal('Error insertando anuncio.');
        log.fatal(error);
    }
};

/**
* Función estática para eliminar todas las listas de tareas
*/
TaskListSchema.statics.deleteAll = async function() {
    try {
        await TaskList.deleteMany({});
    } catch (error) {
        log.fatal('Error eliminando listas de tareas.');
        log.fatal(error);
    }
};

const TaskList = mongoose.model('TaskList', TaskListSchema);
module.exports = TaskList;