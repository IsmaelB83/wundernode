/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import TaskPanel from '../../containers/TaskPanel/TaskPanel';
import UserBar from '../../containers/UserBar/UserBar';
import SearchBar from '../../components/SearchBar/SearchBar';
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
                <div className='createButton'>
                    <button className='createbutton-link' href='' onClick={this.props.onCreate}>
                        <i className='fa fa-plus'></i>Create List
                    </button>  
                </div>
            </div>
        );
    }
}