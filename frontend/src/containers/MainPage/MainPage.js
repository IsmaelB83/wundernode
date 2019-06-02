/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import Sidebar from '../Sidebar/Sidebar';
import TaskPanel from '../TaskPanel/TaskPanel';
import { actions } from '../../store/Store';
/* Import css */
import './MainPage.css';


class MainPageAux extends React.Component {
    
    componentDidMount() {
        // Obtengo el listado de tareas
        fetch('/tasklist/all')
        .then (response => {
            if (response.status === 200) {
                response.json()
                .then (listas => {
                    // Cargo en el store el listado de tareas
                    this.props.loadLists(listas.result);
                    // Obtengo las tareas de la primera lista (inbox)
                    fetch(`/tasklist/task/${listas.result[0]._id}`)
                    .then (response =>{
                        if (response.status === 200) {
                            response.json()
                            .then (tareas =>{
                                // Cargo en el store las tareas de la primera lista
                                this.props.loadTasks(0, listas.result[0],tareas.result);
                            });                            
                        }
                    });
                });
            }
        });
    }

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
        taskLists: state.taskLists,
        currentTasks: state.currentTasks,
    };
};
const mapActions = {
    loadLists: actions.loadTaskLists,
    loadTasks: actions.setTaskList,
}

const MainPage = connect(mapState, mapActions)(MainPageAux);
export default MainPage;