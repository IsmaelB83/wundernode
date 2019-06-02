/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import TaskPanel from '../../components/TaskPanel/TaskPanel';
import UserBar from '../../components/UserBar/UserBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CreateList from '../../components/CreateList/CreateList';
/* Import css */
import './Sidebar.css';


class SidebarAux extends React.Component {
    
    render() {
        return (
            <div className="sidebar" role="navigation">
                <SearchBar/>
                <UserBar/>
                <TaskPanel/>
                <CreateList/>
            </div>
        );
    }
}


// React-Redux
const mapState = (state) => { 
    return { 
        taskLists: state.taskLists,
    };
};

const Sidebar = connect(mapState, null)(SidebarAux);
export default Sidebar;