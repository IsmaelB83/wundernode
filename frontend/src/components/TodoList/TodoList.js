/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import Todo from '../Todo/Todo';
/* Import own css */
import './TodoList.css';


/**
 * Componente para representar una lista de tareas
 */
export default class TodoList extends Component { 

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = { 
            selected: 0,
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <ol className={`TodoList ${this.props.completed?'TodoList--done':''}`}>
            { this.props.todos && 
                ( ( this.props.completed && this.props.showCompleted ) || !this.props.completed ) && 
                this.props.todos.filter(t=>t.completed===this.props.completed).map((todo, index) => {
                    return <li  key={index} data-index={index}
                                onClick={this.todoSelected}>
                                <Todo   text={todo.description} 
                                        active={this.state.selected===index?true:false} 
                                        starred={todo.starred}
                                        completed={todo.completed} 
                                        id={todo.id}
                                        onStarred={this.props.onStarred}
                                        onDone={this.props.onDone}
                                />
                            </li>
                    })
            }
            </ol>
        );
    };

    /**
     * Se selecciona un todo
     * @param {Event} ev Evento que origina el click
     */
    todoSelected = (ev) => {
        this.setState({ 
            selected: parseInt(ev.currentTarget.dataset.index) 
        });
    }

    /**
     * Muestra u oculta los completados
     */
    showCompleted(){
        this.setState({showCompleted: !this.state.showCompleted});
    }
}