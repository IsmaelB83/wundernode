/* Import node modules */
import React from 'react';
/* Import own modules */
import TaskPanel from '../../components/TaskPanel/TaskPanel';
import UserBar from '../../components/UserBar/UserBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CreateTask from '../../components/CreateTask/CreateTask';
/* Import css */
import './Sidebar.css';


export default class Sidebar extends React.Component {
    
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