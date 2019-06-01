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
            res.status(404).json({
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
        if (!taskList || taskList.systemId === 1) {
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
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.modify = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({
                status: 'error', 
                description: 'Task not found',
                result: {}
            });
            return ;
        }
        let oldStarred = task.starred;
        task.description = req.body.description?req.body.description:task.description;
        task.due = req.body.due?req.body.due:task.due;
        task.reminder = req.body.reminder?req.body.reminder:task.reminder;
        task.starred = req.body.starred;
        task.completed = req.body.completed;
        task = await task.save();
        let taskList = await TaskList.findById(task.taskList._id);
        if (taskList && oldStarred !== task.starred) {
            if (task.starred) taskList.starred.push(task);
            else taskList.starred.splice(taskList.starred.indexOf(task._id), 1 );
            await taskList.save();
        }
        let tasks = await Task.find({taskList: taskList._id});
        res.json({status: 'ok', result: {taskList, tasks}});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;