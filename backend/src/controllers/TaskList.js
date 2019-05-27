// Node imports
// Own imports
const { TaskList, Task, User } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let taskLists = await TaskList.find({});
        if (!taskLists || taskLists.length === 0) {
            res.json({
                status: 'error', 
                description: 'Number of taskList lists found is 0',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            description: `Total of taskList lists: ${taskLists.length}`,
            result: taskLists
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
        let taskList = new TaskList({...req.body});
        taskList.active = true;
        let user = await User.findOne({email: 'ismaelbernal83@gmail.com'});
        if (user) {
            taskList.members.push(user);
        }
        user = await User.findOne({email: 'tamazzu@hotmail.com'});
        if (user) {
            taskList.members.push(user);
        }
        await taskList.save();
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.getById = async (req, res, next) => {
    try {
        let taskList = await TaskList.findOne({_id: req.params.id});
        if (!taskList) {
            res.json({
                status: 'error', 
                description: 'Number of taskList lists found is 0',
                result: {}
            });
            return ;
        }
        res.json({
            status: 'ok',
            description: `taskList list found`,
            result: taskList
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

ctrl.updateById = async (req, res, next) => {
    try {
        let taskList = await TaskList.findOne({_id: req.params.id});
        if (!taskList) {
            res.json({
                status: 'error',
                description: `taskList not found`,
                result: {}
            }); 
            return;
        }
        taskList.description = req.body.description;
        taskList.active = req.body.active;
        taskList = await taskList.save();
        if (!taskList) {
            res.json({
                status: 'error',
                description: `Error updating the task`,
                result: {}
            }); 
            return;
        }
        res.json({status: 'ok', result: taskList});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;