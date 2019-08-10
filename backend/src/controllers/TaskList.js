// Node imports
const moment = require('moment');
moment.updateLocale('en', { week : { dow : 1, doy : 4 } } );
// Own imports
const { TaskList, Task, User } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        // Listado
        TaskList.list(req.query.description, req.query.owner, req.query.member, req.query.active, 
            req.query.system, parseInt(req.query.limit), parseInt(req.query.skip), req.query.fields, 
            function(error, results) {
                // Error
                if (error) {
                    next(error);
                    return;
                }
                // Ok
                res.status(200).json({
                    success: true,
                    count: results.length,
                    results: results
                });
        });
        /* // Conformo los arrays de las listas de sistema
        for (let i = 1; i <= 3; i++) {
            const list = taskLists[i];
            switch (list.systemId) {
                case 1:
                    // Starred
                    tasks = await Task.find({
                        starred: true
                    });
                    break;           
                case 2:
                    // Due today
                    tasks = await Task.find({
                        due: { 
                            $lte: moment().endOf('day').toDate() 
                        }
                    });
                    break;
                case 3:
                    // Due week
                    tasks = await Task.find({
                        due: {   
                            $lte: moment().endOf('week').toDate() 
                        }
                    });
                    break;
            }
            list._id = taskLists[0]._id;
            tasks.forEach(t => { 
                list.tasks.push(t._id)
                if (t.starred) list.starred.push(t._id);
            });
        }*/
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
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
            res.status(404).json({
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
            res.status(404).json({
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