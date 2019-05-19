// Import redux
import { createStore } from 'redux';

// App initial state
const initialState = {
    lists: [],
    loading: true,
}

// Actions
export const actions = {
    setLists: (lists) => {
        return {
            type: 'SET_LISTS',
            payload: { 
                lists: lists,
                loading: false,
            }
        }
    }
}
    
// Reducers: definen como cambia el estado para cada acción: estado + acción ==> acción
function charReducer(state, action) {
    let newState = {};
    switch (action.type) {
        case "SET_LISTS":
            newState = {...state};
            newState.lists = action.payload.lists;
            if (!action.payload.lists || action.payload.lists.length < 1) {
                newState.loading = true;
            } else {
                newState.loading = action.payload.loading;
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