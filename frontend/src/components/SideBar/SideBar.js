/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import TaskListPanel from '../TaskListPanel/TaskListPanel';
import UserBar from '../UserBar/UserBar';
import SearchBar from '../SearchBar/SearchBar';
/* Import css */
import './SideBar.css';


/**
 * Componente de barra lateral
 */
export default class SideBar extends Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <div className={`SideBar ${this.state.collapsed?'SideBar-collapsed':''}`} role="navigation">
                <SearchBar searchEventHandler={this.props.searchEventHandler}
                           collapseEventHandler={this.collapseEventHandler}/>
                <UserBar name={this.props.name} email={this.props.email} avatar={this.props.avatar}
                         syncNowEventHandler={this.props.syncNowEventHandler}
                         accountSettingsEventHandler={this.props.accountSettingsEventHandler}
                         signOutEventHandler={this.props.signOutEventHandler}
                         manageFriendsEventHandler={this.props.manageFriendsEventHandler}
                />
                <TaskListPanel lists={this.props.lists} 
                               taskListSelectedEventHandler={this.props.taskListSelectedEventHandler}/>
                <div className='createButton'>
                    <button className='createbutton-link' href='' onClick={this.props.createTaskListEventHandler}>
                        <i className='fa fa-plus'></i>Create List
                    </button>  
                </div>
            </div>
        );
    }

    /**
     * Controla el estado de visualización del sidebar (collapsed o full)
     */
    collapseEventHandler = () => {
        this.setState({collapsed: !this.state.collapsed})
        alert('Revisar impacto de esto en el grid del App');
    }
}