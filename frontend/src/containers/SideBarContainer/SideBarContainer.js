/* Import node modules */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import SideBar from '../../components/SideBar/SideBar';
import { actions } from '../../store/Store';


/**
 * Pagina principal de wundernode
 */
class SideBarContainerAux extends React.Component {
    
    /**
     * Render
     */
    render() {
        return (
            <SideBar name={this.props.user.name} email={this.props.user.email} avatar={this.props.user.avatar}
                     lists={this.props.lists}
                     searchEventHandler={this.searchEventHandler}
                     createTaskListEventHandler={this.props.createTaskListEventHandler} 
                     taskListSelectedEventHandler={this.taskListSelectedEventHandler}
                     syncNowEventHandler={this.syncNowEventHandler}
                     signOutEventHandler={this.signOutEventHandler}
                     logoffEventHandler={this.logoffEventHandler}
                     accountSettingsEventHandler={this.accountSettingsEventHandler}
                     manageFriendsEventHandler={this.manageFriendsEventHandler}
            />
        );
    }


    /**
     * Cuando se hace click en una lista se cargan sus tareas en el estado
     * @param {Event} ev 
     */
    taskListSelectedEventHandler = async (id) => {
        try {
            const response = await Axios.get(`/tasklists/${id}`, { headers: { 'Authorization': 'bearer ' + this.props.user.token } });
            if (response.status === 200) {
                this.props.loadList(response.data.result);
            }               
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Sincronizar datos con la API Rest
     */
    syncNowEventHandler = () => {
        try {
            // Cargar listado de tareas
            Axios.get('/tasklists', { headers: { 'Authorization': 'bearer ' + this.props.user.token }})
            .then (response => {
                if (response.status === 200) {
                    this.props.loadLists(response.data.results);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Logout y redirijo al login
     */
    logoffEventHandler = () => {
        this.props.logoff();
        this.props.history.push('/login');
    }

    /**
     * Logout y redirijo al login
     */
    signOutEventHandler = () => {
        this.props.logoff();
        this.props.history.push('/login');
    }

    /**
     * Manage our friends in the application
     * (NOT IMPLEMENTED YET. Issue #18)
     * @param {Event} ev 
     */
    manageFriendsEventHandler = () => alert('Manage friends not implemented yet');


    /**
     * Search event
     * (NOT IMPLEMENTED YET. Issue #5 )
     */
    searchEventHandler = () => alert('Search not implemented yet');
    
    /**
     * Modal de configuración de la cuenta del usuario
     * (NOT IMPLEMENTED YET. Issue #9 )
     */
    accountSettingsEventHandler = () => alert('Account settings not implemented yet');
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user, 
        lists: state.lists,
        switch: state.switch
    };
};

const mapActions = {
    logoff: actions.logoff,
    loadList: actions.loadList,
    loadLists: actions.loadLists,
    addTaskList: actions.addTaskList,
}

const SideBarContainer = connect(mapState, mapActions)(SideBarContainerAux);
export default withRouter(SideBarContainer);