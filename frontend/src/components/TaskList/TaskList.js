/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import css*/
import './TaskList.css';

class TaskListAux extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    render() {
        return (
            <ul className='tasksList'>
            {   this.props.taskLists && 
                this.props.taskLists.map((value, index) => {
                    return  <li key={value._id} 
                                    className={`${index + 4===this.state.selected?'tasksList--active':''}`}
                                    onClick={this.taskListClick.bind(this)} 
                                    data-index={index}
                            >
                                <TaskItem id={value._id} icon={value.icon} text={value.description} color={value.color} />
                                <div className="taskList-badges">
                                    { value.starred.length > 0 && <span className="badge badge-pill badge-danger">{value.starred.length}</span> }
                                    { value.tasks.length > 0 && <span className="badge badge-pill badge-secondary">{value.tasks.length}</span> }
                                </div>
                            </li>
                })
            }
            </ul>
        );
    };

    async taskListClick(ev) {
        ev.preventDefault();
        let index = ev.currentTarget.dataset.index
        let taskList = this.props.taskLists[index];
        let response = await fetch(`/tasklist/task/${taskList._id}`);
        if (response.status === 200) {
            this.setState({selected: parseInt(index)});
            let json = await response.json();
            if (json) {
                this.props.loadTaskList(taskList, json.result); 
            }
        }
    }
}

class TaskItem extends React.Component {
    render() {
        return (
            <a href='/' className={`taskList-item ${this.props.color?`taskList-item--${this.props.color}`:''}`}>
                <i className={`taskList-icon ${this.props.icon}`}></i>
                {this.props.text}
            </a>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return { 
        taskLists: state.taskLists,
        switch: state.switch
    };
};
const mapActions = { loadTaskList: actions.setTaskList };

const TaskList = connect(mapState, mapActions)(TaskListAux);
export default TaskList;