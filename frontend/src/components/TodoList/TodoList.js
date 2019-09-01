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
     * Initial state
     */
    state = { selected: 0 }

    /**
     * Render
     */
    render() {
        return (
            <ol className={`TodoList ${this.props.completed?'TodoList--done':''}`}>
            { this.props.todos && 
                ( !this.props.completed || ( this.props.completed && this.props.showCompleted ) ) && 
                this.props.todos.filter(t=>t.completed===this.props.completed).map((t, index) => {
                    return <li key={index} data-index={index} onClick={e=>this.setState({selected: parseInt(e.currentTarget.dataset.index)})}>
                                <Todo   id={t.id}
                                        text={t.description} 
                                        active={this.state.selected===index?true:false} 
                                        starred={t.starred}
                                        completed={t.completed} 
                                        closedBy={t.closedBy}
                                        closedAt={t.closedAt}
                                        due={t.due}
                                        todoStarredEventHanlder={this.props.todoStarredEventHanlder}
                                        todoCompleteEventHandler={this.props.todoCompleteEventHandler}
                                />
                            </li>
                    })
            }
            </ol>
        );
    };
}