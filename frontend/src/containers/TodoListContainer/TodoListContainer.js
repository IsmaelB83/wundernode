/* Import node modules */
import React, { Component } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
import { Config } from '../../config';
import TodoList from '../../components/TodoList/TodoList';


/**
 * Container component to handle the functionality of a To-Do list
 */
class TodoListContainerAux extends Component { 

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.audio = new Audio(`${process.env.PUBLIC_URL}${Config.sounds.completed}`);
        this.state = { selected: 0 }
    }

    /**
     * Render
     */
    render() {
        return (
            <TodoList todos={this.props.todos}
                      completed={this.props.completed}
                      showCompleted={this.props.showCompleted}
                      starredEventHanlder={this.starredEventHanlder} 
                      doneEventHandler={this.doneEventHandler} 
            />
        );
    };

    /**
     * Marcar como importante un todo
     * @param {String} id ObjectId del Todo
     * @param {Boolean} starred Todo important (true/false)
     */
    starredEventHanlder = async (id, starred) => {
        try {
            // Call API to starred task
            let result = await Axios.put(`/tasklists/tasks/${id}/star`, null, {
                headers: { 'Authorization': "bearer " + this.props.user.token },
                data: { starred }
            });
            if (result.status === 200) {
                this.props.starTodo(id, starred);
            }
        } catch (error) {
            console.log(error)
        }   
    }

    /**
     * Marcar como completado un todo
     * @param {String} id ObjectId del Todo
     * @param {Boolean} completed Todo completado (true/false)
     * @param {Boolean} starred Todo important (true/false)
     */
    doneEventHandler = async (id, completed, starred) => {
        try {
            // Call API to starred task
            let result = await Axios.put(`/tasklists/tasks/${id}/complete`, null, {
                headers: { 'Authorization': "bearer " + this.props.user.token },
                data: { completed }
            });
            if (result.status === 200) {
                this.audio.currentTime = 0; 
                this.audio.play();     
                this.props.completeTodo(id, completed, starred);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user,
        todos: state.selected.tasks,
        switch: state.switch
    };
};

const mapActions = { 
    starTodo: actions.starTodo,
    completeTodo: actions.completeTodo
};

const TodoListContainer = connect(mapState, mapActions)(TodoListContainerAux);
export default TodoListContainer;