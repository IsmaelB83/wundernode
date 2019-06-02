/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import { actions } from '../../store/Store';
import Todo from '../Todo/Todo';
/* Import own css */
import './TodoPanel.css';

class TodoPanelAux extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    render() {
        return (
            <ol id={this.props.id} className={`todoList ${this.props.completed?'todoList--done':''}`}>
            { this.props.tasks && 
                this.props.tasks.map((value, index) => {
                    if (value.completed === this.props.completed) {
                        return <li key={index} onClick={this.clickLine.bind(this)} data-index={index}>
                                    <Todo text={value.description} 
                                            completed={value.completed} 
                                            active={this.state.selected===index?true:false} 
                                            due={value.due}
                                            star={value.starred}
                                            starredClick={this.todoStarredClick.bind(this)}
                                            index={index}
                                    />
                                </li>
                    } else {
                       return '';
                    }
                })
            }
            </ol>
        );
    };

    clickLine(ev) {
        this.setState({ selected: parseInt(ev.currentTarget.dataset.index) });
    }

    async todoStarredClick(ev) {
        ev.preventDefault();
        try {
            let index = ev.currentTarget.dataset.index;
            let result = await Axios.put(`/tasklist/task/${this.props.tasks[index]._id}`, null, {
                data: {
                    starred: !this.props.tasks[index].starred
                }
            });
            if (result.status === 200) {
                this.props.setTaskList(
                    result.data.result.taskList,
                    result.data.result.tasks
                );
                this.props.refreshTaskLists(
                    result.data.result.taskList._id,
                    this.props.tasks[index]
                )
            }
        } catch (error) {
            console.log(error)
        }   
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
        tasks: state.currentTasks,
        switch: state.switch
    };
};
const mapActions = { 
    setTaskList: actions.setTaskList,
    refreshTaskLists: actions.refreshTaskLists,
};

const TodoPanel = connect(mapState, mapActions)(TodoPanelAux);
export default TodoPanel;