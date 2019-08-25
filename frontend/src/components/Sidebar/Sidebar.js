/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import TaskPanel from '../../containers/TaskPanel/TaskPanel';
import UserBar from '../../containers/UserBar/UserBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CreateTask from '../../containers/CreateTask/CreateTask';
/* Import css */
import './Sidebar.css';


/**
 * Componente de barra lateral
 */
export default class Sidebar extends Component {
    
    /**
     * Render
     */
    render() {
        return (
            <div className="sidebar" role="navigation">
                <SearchBar/>
                <UserBar/>
                <TaskPanel selected={this.props.selected}/>
                <CreateTask/>
            </div>
        );
    }
}