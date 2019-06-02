/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import ButtonHeading from '../../components/Buttons/ButtonHeading';
import ToolBar from '../../components/ToolBar/ToolBar';
import TaskBar from '../../components/TaskBar/TaskBar';
import TodoPanel from '../../components/TodoPanel/TodoPanel';
/* Import css */
import './TaskPanel.css';


class TaskPanelAux extends React.Component {

    render() {
        return (
            <div className='task'>
                <ToolBar/>
                <div className='taskScWrapper'>
                    <TaskBar/>
                    <div className='showCompleted'>
                        <TodoPanel id='todosPending' completed={false}/>
                        <ButtonHeading/>
                        <TodoPanel id='todosDone' completed={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
        taskLists: state.taskLists,
        switch: state.switch
    };
};

const TaskPanel = connect(mapState, null)(TaskPanelAux);
export default TaskPanel;