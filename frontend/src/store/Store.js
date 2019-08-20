// Import redux
import { createStore } from 'redux';
// Import own modules
import utils from './utils';

// App initial state
const initialState = {
    user: {},
    lists: [],
    selected: {},
    switch: false, // Hack to force update in nested structures such as taskLists
}

// Actions
export const actions = {
    login: (user) => {
        return {
            type: 'LOGIN',
            payload: {
                user: user,
            }
        }
    },
    logoff: (user) => {
        return {
            type: 'LOGOFF',
            payload: {
                user: user,
            }
        }
    },
    loadLists: (lists) => {
        return {
            type: 'LOAD_LISTS',
            payload: { 
                lists: lists,
            }
        }
    },
    loadList: (list) => {
        return {
            type: 'LOAD_LIST',
            payload: {
                list: list,
            }
        }
    },
    addTodo: (todo) => {
        return {
            type: 'ADD_TODO',
            payload: {
                todo: todo,
            }
        }
    },
    starredTodo: (index, starred) => {
        return {
            type: 'STARRED_TODO',
            payload: {
                index: index,
                starred: starred
            }
        }
    },
}
    
// Reducers: definen como cambia el estado para cada acción: estado + acción ==> acción
function charReducer(state, action) {
    let newState = {};
    switch (action.type) {
        case 'LOGIN':
            newState = {...state};
            newState.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(newState.user));
            return newState;
        case 'LOGOFF':
            newState = {...state};
            newState.user = {};
            localStorage.clear('user');
            return newState;
        case 'LOAD_LISTS':
            newState = {...state};
            newState.lists = action.payload.lists;
            newState.selected = action.payload.lists[0];
            return newState;
        case 'LOAD_LIST':
            newState = {...state};
            newState.selected = action.payload.list;
            return newState;
        case 'ADD_TODO':
            newState = {...state};
            let list = newState.lists[newState.selected];
            if (newState.selected <= 3) list = newState.lists[0];
            list.tasks.push(action.payload.todo._id);
            newState.todos.push(action.payload.todo);
            utils.updateListsStarred(newState.lists[1], newState.lists[2], newState.lists[3], list, action.payload.todo);
            return newState;
        case 'STARRED_TODO': 
            newState = {...state};
            newState.todos[action.payload.index].starred = action.payload.starred;
            for (let i = 0; i < newState.lists.length; i++) {
                if (newState.lists[i]._id === newState.todos[action.payload.index].taskList) {
                    utils.updateListsStarred(newState.lists[1], newState.lists[2], newState.lists[3], newState.lists[i], newState.todos[action.payload.index]);
                    break;
                }
            }
            newState.switch = !newState.switch;
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