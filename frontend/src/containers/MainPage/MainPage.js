/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import Sidebar from '../Sidebar/Sidebar';
import TaskPanel from '../TaskPanel/TaskPanel';
/* Import css */
import './MainPage.css';


class MainPageAux extends React.Component {
    
    render() {
        return (
            <div className="wrapper"> 
                <Sidebar/>
                <TaskPanel/>
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
        taskLists: state.taskLists
    };
};
const MainPage = connect(mapState, null)(MainPageAux);
export default MainPage;