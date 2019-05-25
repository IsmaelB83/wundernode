/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import ToolBar from '../../components/ToolBar/ToolBar';
import AddTaskBar from '../../components/AddTaskBar/AddTaskBar';
import TodoList from '../../components/TodoList/TodoList';
/* Import css */
import './TaskPanel.css';


class TaskPanelAux extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    componentDidMount() {
    }

    render() {
        return (
            <div className="task">
                <ToolBar/>
                <div className="task-scroll">
                    <AddTaskBar/>
                    <div className="showCompleted">
                        <TodoList id="tasksPending" completed={false}/>
                        <a href="/" className="heading heading--normal mt-2">Show completed to-dos</a>
                        <TodoList id="tasksDone" completed={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
    };
};
const TaskPanel = connect(mapState, null)(TaskPanelAux);
export default TaskPanel;