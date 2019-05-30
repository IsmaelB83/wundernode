// Import redux
import { createStore } from 'redux';

// App initial state
const initialState = {
    taskLists: [],
    tasks: [],
    loadingLists: true,
    loadingTasks: true,
}

// Actions
export const actions = {
    setTaskLists: (taskLists) => {
        return {
            type: 'SET_TASKLISTS',
            payload: { 
                taskLists: taskLists,
                loadingLists: false,
            }
        }
    },
    setTasksOfList: (tasks) => {
        return {
            type: 'SET_TASKSOFLIST',
            payload: { 
                tasks: tasks,
                loadingTasks: false,
            }
        }
    }
}
    
// Reducers: definen como cambia el estado para cada acción: estado + acción ==> acción
function charReducer(state, action) {
    let newState = {};
    switch (action.type) {
        case "SET_TASKLISTS":
            newState = {...state};
            newState.taskLists = action.payload.taskLists;
            if (!action.payload.taskLists || action.payload.taskLists.length < 1) {
                newState.loadingLists = true;
            } else {
                newState.loadingLists = action.payload.loading;
            }
            return newState;
        case "SET_TASKSOFLIST":
            newState = {...state};
            newState.tasks = action.payload.tasks;
            if (!action.payload.tasks || action.payload.tasks.length < 1) {
                newState.loadingTasks = true;
            } else {
                newState.loadingTasks = action.payload.loading;
            }
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