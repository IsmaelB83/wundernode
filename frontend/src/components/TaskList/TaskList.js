/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
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
            { this.props.taskLists && 
                this.props.taskLists.map((value, index) => {
                    return  <li key={value._id} 
                                className={`${index===this.state.selected?'tasksList--active':''}`}
                                onClick={this.taskListClick.bind(this)} 
                                data-target={`/tasklist/task/${value._id}`}
                            >
                                <TaskItem id={value._id} icon={value.icon} text={value.description} color={value.color} />
                            </li>
                })}
            }
            </ul>
        );
    };

    async taskListClick(ev) {
        ev.preventDefault();
        let response = await fetch(ev.currentTarget.dataset.target)
        if (response.status === 200) {
            let json = await response.json();
            console.log(json.result);
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
        taskLists: state.taskLists
    };
};
const TaskList = connect(mapState, null)(TaskListAux);
export default TaskList;