// Import redux
import { createStore } from 'redux';
import Axios from 'axios';


// App initial state
const initialState = {
    user: {},
    lists: [],
    selected: {},
    switch: false
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
    starTodo: (id, starred) => {
        return {
            type: 'STAR_TODO',
            payload: {
                id: id,
                starred: starred
            }
        }
    },
    completeTodo: (id, completed, starred) => {
        return {
            type: 'COMPLETE_TODO',
            payload: {
                id: id,
                completed: completed,
                starred: starred
            }
        }
    },
    addTaskList: (taskList) => {
        return {
            type: 'ADD_TASKLIST',
            payload: {
                taskList: taskList,
            }
        }
    },
    addMembers: (members) => {
        return {
            type: 'ADD_MEMBERS',
            payload: {
                members: members,
            }
        }
    }
}
    
// Reducers: definen como cambia el estado para cada acción: estado + acción ==> acción
function charReducer(state, action) {
    let newState = {};
    switch (action.type) {
        case 'LOGIN':
            newState = {...state};
            // Cargo el usuario en el store y en el localstorag
            newState.user = action.payload.user;
            // TEMPORAL
            newState.user.friends = [];
            Axios.get('/users/friends', { headers: { 'Authorization': "bearer " + newState.user.token }})
            .then (result => result.data.results.forEach(u => newState.user.friends.push(u)))
            .catch(error => alert('No se han encontrado amigos'));
            // Register user in local storage (TEMPORAL. Not secure)
            localStorage.setItem('user', JSON.stringify(newState.user));
            return newState;
        case 'LOGOFF':
            newState = {...state};
            // Reseteo el estado
            newState.user = {};
            newState.lists = [];
            newState.selected = {};
            localStorage.clear();
            return newState;
        case 'LOAD_LISTS':
            newState = {...state};
            // Genero el array de listas
            newState.lists = [];
            action.payload.lists.forEach(l => {
                newState.lists.push({
                    id: l._id,
                    description: l.description,
                    starred: parseInt(l.tasks.filter(task => task.starred && !task.completed).length),
                    tasks: parseInt(l.tasks.filter(task => !task.completed).length)
                });
            });
            // Genero el objeto de la lista actual
            let index = 0;
            if (newState.selected.id) {
                index = newState.lists.findIndex(l => l.id === newState.selected.id);
            }
            newState.selected.id = action.payload.lists[index]._id;
            newState.selected.description = action.payload.lists[index].description;
            newState.selected.members = action.payload.lists[index].members;
            newState.selected.owner = action.payload.lists[index].owner;
            newState.selected.tasks = [];
            action.payload.lists[index].tasks.forEach(t => {
                newState.selected.tasks.push({
                    id: t._id,
                    description: t.description,
                    completed: t.completed,
                    starred: t.starred,
                });
            });
            return newState;
        case 'LOAD_LIST':
            newState = {...state};
            // Genero el objeto de la lista actual
            newState.selected.id = action.payload.list._id;
            newState.selected.description = action.payload.list.description;
            newState.selected.members = action.payload.list.members;
            newState.selected.owner = action.payload.list.owner;
            newState.selected.tasks = [];
            action.payload.list.tasks.forEach(t => {
                newState.selected.tasks.push({
                    id: t._id,
                    description: t.description,
                    completed: t.completed,
                    starred: t.starred,
                });
            });
            return newState;
        case 'ADD_TODO':
            newState = {...state};
            // Añado un todo a la lista actual
            newState.selected.tasks.push({
                id: action.payload.todo._id,
                description: action.payload.todo.description,
                completed: false,
                starred: action.payload.todo.starred
            });
            // Añado un todo al panel de listas
            index = newState.lists.findIndex(l => l.id === newState.selected.id);
            if (index >= 0) {
                newState.lists[index].tasks++;
                newState.lists[index].starred+=action.payload.todo.starred?1:0;
            }
            // Forzar el render
            newState.switch = !newState.switch;
            return newState;
        case 'STAR_TODO': {
            newState = {...state};
            // Busco la tarea en la lista seleccionada y la actualizo
            const i = newState.selected.tasks.findIndex(t => t.id === action.payload.id);
            if (i >= 0) {
                newState.selected.tasks[i].starred = action.payload.starred;
            }
            // Busco la lista en el array de listas y lo sobreescribo
            const j = newState.lists.findIndex(l => l.id === newState.selected.id);
            if (j >= 0) {
                newState.lists[j].starred += action.payload.starred?1:-1;
            }
            // Forzar el render
            newState.switch = !newState.switch;
            return newState;
        }
        case 'COMPLETE_TODO': {
            newState = {...state};
            // Busco la tarea en la lista seleccionada y la actualizo
            const i = newState.selected.tasks.findIndex(t => t.id === action.payload.id);
            if (i >= 0) {
                newState.selected.tasks[i].completed = action.payload.completed;
            }
            // Busco la lista en el array de listas y lo sobreescribo
            const j = newState.lists.findIndex(l => l.id === newState.selected.id);
            if (j >= 0) {
                newState.lists[j].tasks += action.payload.completed?-1:1;  
                if (action.payload.completed && action.payload.starred) {
                    newState.lists[j].starred--;
                } else if(!action.payload.completed && action.payload.starred) {
                    newState.lists[j].starred++;
                }
            }
            // Forzar el render
            newState.switch = !newState.switch;
            return newState;
        }
        case 'ADD_TASKLIST': {
            newState = {...state};
            // Añado lista al panel de listas
            newState.lists.push({
                id: action.payload.taskList._id,
                description: action.payload.taskList.description,
                starred: 0,
                tasks: 0,
            });
            newState.switch = !newState.switch;
            return newState;
        }
        case 'ADD_MEMBERS': {
            newState = {...state};
            // Añado miembros a la lista actual
            const i = newState.lists.findIndex(l => l.id === newState.selected.id);
            action.payload.members.forEach(m => {
                newState.selected.members.push(m);
                if (i >= 0) {
                    newState.lists[i].members.push(m);
                }
            });
            // Forzar el render
            newState.switch = !newState.switch;
            return newState;
        }   
        default:
            return state;
    }
}

// Store
export const store = createStore(charReducer, initialState);

// Debug 
window.store = store;
window.actions = actions;