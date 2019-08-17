'use strict';
// Node imports
const fs = require('fs');
// Own imports
const database = require('./index');
const { User, TaskList, Task } = require('../models');
const { config } = require('../config');
const { Log } = require('../utils');


// Inicializar base de datos
initDB();

/**
 * Función para inicializar la base de datos y cargar los anuncios predefinidos
 */
async function initDB() {
    try {
        // Conecto a la base de datos
        await database.connectToMongo(config.mongodb);
        // Borro los datos de las colecciones
        await User.deleteAll();
        await Task.deleteAll();
        await TaskList.deleteAll();
        // Creo los datos desde el json
        let dump = JSON.parse(fs.readFileSync('data.json', 'utf8'));
        // Usuarios
        let users = [];
        for (let i = 0; i < dump.Users.length; i++) {
            const user = await User.insert(new User({...dump.Users[i]}));
            users.push (user);
        }
        // Tasklists
        let taskLists = [];
        for (let i = 0; i < dump.TaskLists.length; i++) {
            let taskList = new TaskList({...dump.TaskLists[i]});
            taskList.owner = users[dump.TaskLists[i].owner].id;
            taskList.members = [users[dump.TaskLists[i].owner].id];
            taskLists.push (taskList);
        }
        taskLists = await TaskList.insertAll(taskLists);
        // Tasks
        let tasks = [];
        for (let i = 0; i < dump.Tasks.length; i++) {
            let task = new Task({...dump.Tasks[i]});
            let taskList = taskLists[dump.Tasks[i].list];
            task.taskList = taskList.id;
            taskList.tasks.push(task);
            await taskList.save();
            tasks.push (task);
        }
        tasks = await Task.insertAll(tasks);
        // Log
        Log.info(`Base de datos inicializada con exito. Puede arrancar la API mediante "npm start".`);        
    } catch (error) {
        Log.fatal('ERROR incontrolado.');
        Log.fatal(error);
    }
}