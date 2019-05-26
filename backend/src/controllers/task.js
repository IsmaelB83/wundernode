// Node imports
// Own imports
const { Task } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let tasks = await Task.find({});
        console.log(tasks);
        if (!tasks || tasks.length === 0) {
            res.json({
                status: 'error', 
                description: 'Number of task lists found is 0',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            description: `Total of task lists: ${tasks.length}`,
            result: tasks
        });
    } catch (error) {
        res.json({
            status: 'error',
            description: `Uncontrolled error: ${error}`,
            result: tasks
        });
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let task = new Task({...req.body});
        task.published = Date.now();
        task.updated = task.published;
        task.active = true;
        await task.save();
        res.json({status: 'ok', result: task});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.getById = async (req, res, next) => {
    try {
        let task = await Task.findOne({_id: req.params.id});
        if (!task) {
            res.json({
                status: 'error', 
                description: 'Number of task lists found is 0',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            description: `Task list found`,
            result: task
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.updateById = async (req, res, next) => {
    try {
        let task = await Task.findOne({_id: req.params.id});
        if (!task) {
            res.json({
                status: 'error',
                description: `Task not found`,
                result: {}
            }); 
            return;
        }
        task.description = req.body.description;
        task.active = req.body.active;
        task.updated = Date.now();        
        task = await task.save();
        if (!task) {
            res.json({
                status: 'error',
                description: `Error updating the task`,
                result: {}
            }); 
            return;
        }
        res.json({status: 'ok', result: task});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;