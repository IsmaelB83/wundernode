/* Import node modules */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import SearchBar from '../../components/SearchBar/SearchBar';
import UserBar from '../../components/UserBar/UserBar';
import TaskListPanel from '../../components/TaskListPanel/TaskListPanel';
import { actions } from '../../store/Store';
/* Import css */
import './SideBarContainer.css';


/**
 * Pagina principal de wundernode
 */
class SideBarContainerAux extends React.Component {
    
    /**
     * Render
     */
    render() {
        return (
            <aside className={`SideBar ${this.props.collapsed?'SideBar--collapsed':''}`} role="navigation">
                <div className={`SideBar-SearchBar ${this.props.collapsed?'hidden':''}`}>
                    <SearchBar searchEventHandler={this.searchEventHandler} collapseEventHandler={this.collapseEventHandler}/>
                </div>
                <div className={`SideBar-UserBar ${this.props.collapsed?'hidden':''}`}>
                    <UserBar name={this.props.user.name} email={this.props.user.email} avatar={this.props.user.avatar}
                             syncNowEventHandler={this.syncNowEventHandler}
                             accountSettingsEventHandler={this.accountSettingsEventHandler}
                             signOutEventHandler={this.signOutEventHandler}
                             manageFriendsEventHandler={this.manageFriendsEventHandler}
                             createTaskListEventHandler={this.props.createTaskListEventHandler}
                    />
                </div>
                <div className={`SideBar-TaskList ${this.props.collapsed?'hidden':''}`}>
                    <TaskListPanel lists={this.props.lists} 
                                   taskListSelectedEventHandler={this.taskListSelectedEventHandler}/>
                </div>
                <div className={`SideBar-ButtonCreate ${this.props.collapsed?'hidden':''}`}>
                    <button onClick={this.props.createTaskListEventHandler}><i className='fa fa-tasks'></i>Create List</button>  
                </div>                
            </aside>
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
                if (window.innerWidth<750) {
                    this.props.collapseSideBar();
                }
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
     * Controla el estado de visualización del sidebar (collapsed o full)
     */
    collapseEventHandler = () => this.props.collapseSideBar();

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
        lists: state.lists,
        switch: state.switch,
        collapsed: state.collapsed,
    };
};

const mapActions = {
    logoff: actions.logoff,
    loadList: actions.loadList,
    loadLists: actions.loadLists,
    addTaskList: actions.addTaskList,
    collapseSideBar: actions.collapseSideBar,
}

const SideBarContainer = connect(mapState, mapActions)(SideBarContainerAux);
export default withRouter(SideBarContainer);