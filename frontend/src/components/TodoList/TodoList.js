/* Import node modules */
import React from 'react';
/* Import own modules */
import './TodoList.css';

export default class TodoList extends React.Component {
  
    render() {
        return (
            <ol id="tasks" className={`taskList ${this.props.completed && 'tasks--done'}`}>
                <li>
                    <TodoItem text="Comprar leche" completed={this.props.completed}/>
                </li>
                <li>
                    <TodoItem text="Comprar coca cola" completed={this.props.completed}/>
                </li>
                <li>
                    <TodoItem text="Comprar nutella" completed={this.props.completed}/>
                </li>
            </ol>
        );
    };
}

class TodoItem extends React.Component {
    render() {
        return (
            <div class="taskItem-body taskItem-body--active">
                <a href="/" className="taskcheck-wrapper">
                    <span><i class={`far ${this.props.completed===true?'fa-check-square':'fa-square'}`}></i></span>
                </a>
                <div className="taskname-wrapper">
                    <span className="task-name">{this.props.text}</span>
                    {this.props.completed===true && <small>a few seconds ago by ismael</small>}
                </div>
                <a href="/" className="task-star">
                    <i class="far fa-star"></i>
                </a>
            </div>
        );
    };
}