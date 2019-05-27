// Node imports
// Own imports
const { Task, TaskList, User } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let taskList = await TaskList.find({_id: req.params.id});
        if (!taskLists) {
            res.json({
                status: 'error', 
                description: 'Task list not found',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            result: taskList.tasks
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
        debugger;
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
        taskList.tasks.push(task);
        await taskList.save();
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;