// Node imports
// Own imports
const { Task, TaskList, User } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let tasks;
        if (req.params.id !== 'all') tasks = await Task.find({taskList: req.params.id});
        else tasks = await Task.find();
        if (!tasks) {
            res.json({
                status: 'error', 
                description: 'Task list not found',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            result: tasks
        });
    } catch (error) {
        res.json({
            status: 'error',
            description: `Uncontrolled error: ${error}`,
            result: {}
        });
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let taskList = await TaskList.findById(req.body.id);
        if (!taskList) {
            res.json({
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
        await task.save();
        await taskList.save();
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.modify = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            res.json({
                status: 'error', 
                description: 'Task not found',
                result: {}
            });
            return ;
        }
        task.owner = req.body.owner;
        task.description = req.body.description;
        task.due = req.body.due;
        task.reminder = req.body.reminder;
        task.starred = req.body.starred;
        task.completed = req.body.completed;
        await task.save();
        res.json({status: 'ok', result: task});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;