// Import redux
import { createStore } from 'redux';

// App initial state
const initialState = {
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
    setTaskList: (taskList, tasks) => {
        return {
            type: 'SET_TASKLIST',
            payload: { 
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
        case "LOAD_TASKLISTS":
            newState = {...state};
            newState.taskLists = action.payload.taskLists;
            for (let i = 0; i < newState.taskLists.length; i++) {
                if (newState.taskLists[i].system && newState.taskLists[i].systemId === 0) {
                    newState.inboxId = newState.taskLists[i]._id;
                    break;
                }
            }
            return newState;
        case "SET_TASKLIST":
            newState = {...state};
            newState.currentTaskList = action.payload.taskList;
            newState.currentTasks = action.payload.tasks;
            return newState;
        case "REFRESH_TASKLISTS":
            newState = {...state};
            for (let i = 0; i < newState.taskLists.length; i++) {
                let taskList = newState.taskLists[i];
                if (taskList._id === action.payload.id) {
                    // Añadir al array de tasks sólo si no existe previamente
                    let index = taskList.tasks.indexOf(action.payload.task._id);
                    if (index<0) taskList.tasks.push(action.payload.task._id);  
                    // Añadir al array de starred sólo si no existe previamente
                    index = taskList.starred.indexOf(action.payload.task._id);
                    if (action.payload.task.starred && index < 0) {
                        taskList.starred.push(action.payload.task._id);
                        newState.taskLists[1].starred.push(action.payload.task._id);
                    } else if (!action.payload.task.starred && index>=0) {
                        taskList.starred.splice(index, 1);
                        index = newState.taskLists[1].starred.indexOf(action.payload.task._id);
                        if (index>=0) {
                            newState.taskLists[1].starred.splice(index, 1);
                        }
                    }
                    break;
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