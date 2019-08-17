// Import redux
import { createStore } from 'redux';
// Import own modules
import utils from './utils';

// App initial state
const initialState = {
    user: {},
    lists: [],
    selected: 0,
    todos: [],
    switch: false, // Hack to force update in nested structures such as taskLists
}

// Actions
export const actions = {
    start: (user) => {
        return {
            type: 'START',
            payload: {
                user: user
            }
        }
    },
    login: (user) => {
        return {
            type: 'LOGIN',
            payload: {
                user: user,
            }
        }
    },
    init: (lists) => {
        return {
            type: 'INIT',
            payload: { 
                lists: lists,
            }
        }
    },
    reloadLists: (lists) => {
        return {
            type: 'RELOAD_LISTS',
            payload: { 
                lists: lists,
            }
        }
    },
    reloadList: (list, todos) => {
        return {
            type: 'RELOAD_LIST',
            payload: { 
                list: list,
                todos: todos,
            }
        }
    },
    loadList: (selected, list, todos) => {
        return {
            type: 'LOAD_LIST',
            payload: {
                selected: selected,
                list: list,
                todos: todos
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
        case 'START': 
            newState = {...state};
            newState.user = action.payload.user;
            return newState;
        case 'LOGIN':
            newState = {...state};
            newState.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(newState.user));
            return newState;
        case 'INIT':
            newState = {...state};
            newState.selected = 0;
            newState.lists = action.payload.lists;
            newState.switch = !newState.switch;
            return newState;
        case 'RELOAD_LISTS':
            newState = {...state};
            newState.lists = action.payload.lists;
            newState.switch = !newState.switch;
            return newState;
        case 'RELOAD_LIST':
            newState = {...state};
            newState.lists[newState.selected] = action.payload.list;
            newState.todos = action.payload.todos;
            newState.switch = !newState.switch;
            return newState;
        case 'LOAD_LIST':
            newState = {...state};
            newState.selected = action.payload.selected;
            newState.lists[action.payload.selected] = action.payload.list;
            newState.todos = action.payload.todos;
            newState.switch = !newState.switch;
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