/* Import node modules */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './assets/js/serviceWorker';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'; 
/* Import own modules */
import App from './containers/App/App';
import Login from './containers/Login/Login';
import Reset from './containers/Login/Reset';
import NewUser from './containers/Login/NewUser';
import Activate from './containers/Login/Activate';
import ResetRequest from './containers/Login/ResetRequest';
import { store } from './store/Store';
/* Import css */
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/css/index.css';

// Estructura de componentes react
let reactComp = <Provider store={store}>
                    <Router>
                        <Switch>
                            <Route path='/login' exact component={Login} />
                            <Route path='/new' exact component={NewUser} />
                            <Route path='/activate/:token' exact component={Activate} />
                            <Route path='/reset' exact component={ResetRequest} />
                            <Route path='/reset/password/:token' exact component={Reset} />
                            <Route path='/' exact component={App} />
                            <Redirect to="/login"/>
                        </Switch>
                    </Router>
                </Provider>;
ReactDOM.render( reactComp, document.getElementById('root'));

// Service worker
serviceWorker.unregister();
