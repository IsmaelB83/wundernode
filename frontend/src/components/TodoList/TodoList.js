/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import own css */
import './TodoList.css';

class TodoListAux extends React.Component { 

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
                                    <TodoItem text={value.description} 
                                            completed={value.completed} 
                                            active={this.state.selected===index?true:false} 
                                            star={value.starred}
                                            starredClick={this.todoStarredClick.bind(this)}
                                            index={index}
                                    />
                                </li>
                    }
                    return '';
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
                this.props.loadTaskList(
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

class TodoItem extends React.Component {

    render() {
        return (
            <div className={`todo ${this.props.active?'todo--active':''}`}>
                <a href='/' className='todo-check'>
                    <i className={`far ${this.props.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`todo-nameWrapper ${this.props.completed?'todo--done':''}`}>
                    <span className='todo-name'>{this.props.text}</span>
                    {this.props.completed && <small className='todo-done'>a few seconds ago by ismael</small>}
                </div>
                <div className={`todo-star ${this.props.star?'todo-star--starred':''}`}>
                    <a href='/' onClick={this.props.starredClick} data-index={this.props.index}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return { 
        tasks: state.currentTasks,
        switch: state.switch,
    };
};
const mapActions = { 
    loadTaskList: actions.setTaskList,
    refreshTaskLists: actions.refreshTaskLists,
};

const TodoList = connect(mapState, mapActions)(TodoListAux);
export default TodoList;