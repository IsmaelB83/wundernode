/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import { actions } from '../../store/Store';
import Todo from '../Todo/Todo';
import Config from '../../config/index';
/* Import own css */
import './TodoList.css';

// Completed audio
const audio = new Audio(`${process.env.PUBLIC_URL}${Config.sounds.completed}`);


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
            { this.props.selected.tasks && 
                ( ( this.props.completed && this.props.showCompleted ) || !this.props.completed ) && 
                this.props.selected.tasks.map((value, index) => {
                    if (value.completed === this.props.completed) {
                        return <li key={index} onClick={this.clickLine.bind(this)} data-index={index}>
                                    <Todo   text={value.description} 
                                            completed={value.completed} 
                                            active={this.state.selected===index?true:false} 
                                            due={value.due}
                                            star={value.starred}
                                            index={index}
                                            eventStarred={this.handlerStarred.bind(this)}
                                            handlerComplete={this.handlerComplete.bind(this)}
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

    async handlerStarred(ev) {
        ev.preventDefault();
        try {
            // Call API to starred task
            let index = ev.currentTarget.dataset.index;
            if (index >= 0) {
                let todo = this.props.selected.tasks[index];
                let result = await Axios.put(`/tasklist/task/${todo._id}`, null, {
                    data: { starred: !todo.starred }
                });
                if (result.status === 200) {
                    // Update state
                    this.props.starredTodo(index, !todo.starred);
                }
            }
        } catch (error) {
            console.log(error)
        }   
    }

    async handlerComplete(ev) {
        ev.preventDefault();
        try {
            // Call API to complete task
            let index = ev.currentTarget.dataset.index;
            if (index >= 0) {
                let todo = this.props.selected.tasks[index];
                let result = await Axios.put(`/tasklist/task/${todo._id}`, null, {
                    data: { completed: !todo.completed }
                });
                if (result.status === 200) {
                    // Audio
                    audio.pause();
                    audio.currentTime = 0;
                    audio.play();     
                    // Update state
                    this.props.completeTodo(index, !todo.completed);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        selected: state.selected,
        switch: state.switch
    };
};

const mapActions = { 
    reloadList: actions.reloadList,
    starredTodo: actions.starredTodo,
    completeTodo: actions.completeTodo,
};

const TodoList = connect(mapState, mapActions)(TodoListAux);
export default TodoList;