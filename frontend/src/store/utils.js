let moment = require('moment');
moment.locale('en', { week : { dow : 1, doy : 4 } } );

const utils = {
    updateListsStarred: (starred, today, week, list, todo) => {
        if (todo.starred) {
            // Añadir a las listas en starred
            list.starred.push(todo._id);
            starred.starred.push(todo._id);
            starred.tasks.push(todo._id);
            if (todo.due) {
                if (moment().endOf('day').isAfter(todo.due)) {
                    today.starred.push(todo._id);
                    if (today.tasks.indexOf(todo._id) === -1) {
                        today.tasks.push(todo._id);
                    }
                } 
                if (moment().endOf('week').isAfter(todo.due)) {
                    week.starred.push(todo._id);
                    if (week.tasks.indexOf(todo._id) === -1) {
                        week.tasks.push(todo._id);
                    }
                }
            }
        } else {
            // Eliminar
            let index = list.starred.indexOf(todo._id)
            if (index >= 0) list.starred.splice(index, 1);
            index = starred.starred.indexOf(todo._id)
            if (index >= 0) starred.starred.splice(index, 1);
            index = starred.tasks.indexOf(todo._id)
            if (index >= 0) starred.tasks.splice(index, 1);
            index = today.starred.indexOf(todo._id);
            if (index >= 0) today.starred.splice(index, 1);
            index = week.starred.indexOf(todo._id);
            if (index >= 0) week.starred.splice(index, 1);
        }
    }
}

module.exports = utils;

