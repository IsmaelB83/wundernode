/* Import node modules */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './assets/js/serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'; 
/* Import own modules */
import MainPage from './containers/MainPage/MainPage';
import { store, actions } from './Store';
/* Import css */
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/css/index.css';

// Estructura de componentes react
let reactComp = <Provider store={store}>
                    <Router>
                        <Switch>
                            <Route path='/' exact component={MainPage} />
                        </Switch>
                    </Router>
                </Provider>;
ReactDOM.render( reactComp, document.getElementById('root'));

// Service worker
serviceWorker.unregister();

// Cargar lista de tareas
retrieveTaskLists();
async function retrieveTaskLists() {
    let response = await fetch('/tasklist/all');
    if (response.status === 200) {
        let json = await response.json();
        store.dispatch(actions.setTaskLists(json.result));
        if (json.result.length > 0) {
            response = await fetch(`/tasklist/task/${json.result[4]._id}`);
            if (response.status === 200) {
                json = await response.json();
                store.dispatch(actions.setTasksOfList(json.result));
            }
        }
    }
}