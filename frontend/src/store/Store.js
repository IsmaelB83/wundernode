// Import redux
import { createStore } from 'redux';

// App initial state
const initialState = {
    selectedList: 0,
    username: 'ismael bernal',
    inboxId: '',
    taskLists: [],
    currentTaskList: null,
    currentTasks: [],
    switch: false, // Hack to force update in nested structures such as taskLists
}

// Actions
export const actions = {
    loadTaskLists: (taskLists) => {
        return {
            type: 'LOAD_TASKLISTS',
            payload: { 
                taskLists: taskLists,
            }
        }
    },
    setTaskList: (selected, taskList, tasks) => {
        return {
            type: 'SET_TASKLIST',
            payload: {
                selected: selected,
                taskList: taskList,
                tasks: tasks,
            }
        }
    },
    refreshTaskLists: (id, task) => {
        return {
            type: 'REFRESH_TASKLISTS',
            payload: { 
                id: id,
                task: task
            }
        }
    },
}
    
// Reducers: definen como cambia el estado para cada acción: estado + acción ==> acción
function charReducer(state, action) {
    let newState = {};
    switch (action.type) {
        case 'LOAD_TASKLISTS':
            newState = {...state};
            newState.taskLists = action.payload.taskLists;
            newState.switch = !newState.switch;
            return newState;
        case 'SET_TASKLIST':
            newState = {...state};
            newState.selectedList = action.payload.selected;
            newState.currentTaskList = action.payload.taskList;
            newState.currentTasks = action.payload.tasks;
            newState.switch = !newState.switch;
            return newState;
        case 'REFRESH_TASKLISTS':
            newState = {...state};
            // Variables
            let starred = newState.taskLists[1];
            let today = newState.taskLists[2];
            let week = newState.taskLists[3];
            // Actualizar la lista propietaria de la tarea
            for (let i = 0; i < newState.taskLists.length; i++) {
                let list, index;
                list = newState.taskLists[i];
                if (list._id === action.payload.id) {
                    // Actualizar lista propietaria
                    index = list.tasks.indexOf(action.payload.task._id);
                    if (index<0) list.tasks.push(action.payload.task._id);  
                    if (action.payload.task.starred) {
                        index = list.starred.indexOf(action.payload.task._id);
                        if (index<0) list.starred.push(action.payload.task._id);
                        // Añadir a la de starred
                        index = starred.tasks.indexOf(action.payload.task._id);
                        if (index<0) {
                            starred.tasks.push(action.payload.task._id);  
                            starred.starred.push(action.payload.task._id);  
                        }
                    } else {
                        index = list.starred.indexOf(action.payload.task._id);
                        if (index>=0) list.starred.splice(index,1);
                        // Quitar de la de starred
                        index = starred.tasks.indexOf(action.payload.task._id);
                        if (index>=0) {
                            starred.tasks.splice(index,1);
                            starred.starred.splice(index,1);
                        }
                        // Quitar de la diaria
                        index = today.starred.indexOf(action.payload.task._id);
                        if (index>=0) today.starred.splice(index,1);
                        // Quitar de la semanal
                        index = week.starred.indexOf(action.payload.task._id);
                        if (index>=0) week.starred.splice(index,1);
                    }
                    // Añadir/Quitar de las de vencimientos
                    if (action.payload.task.due) {
                        
                    } else {
                        // Lista diaria
                        index = today.tasks.indexOf(action.payload.task._id);
                        if (index>=0) today.tasks.splice(index,1);
                        index = today.starred.indexOf(action.payload.task._id);
                        if (index>=0) today.starred.splice(index,1);
                        // Lista semana
                        index = week.tasks.indexOf(action.payload.task._id);
                        if (index>=0) week.tasks.splice(index,1);
                        index = week.starred.indexOf(action.payload.task._id);
                        if (index>=0) week.starred.splice(index,1);
                    }
                }                 
            }
            newState.switch = !state.switch;
            return newState;
        default:
            return state;
    }
}

// Store
export const store = createStore(charReducer, initialState);

// Debug 
window.store = store;
window.actions = actions;