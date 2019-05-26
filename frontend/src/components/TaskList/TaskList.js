/* Import node modules */
import React from 'react';
/* Import own modules */
/* Import css*/
import './TaskList.css';

export default class TaskList extends React.Component {
  
    render() {
        return (
            <ul className='tasksList'>
                <li>
                    <TaskItem icon='fas fa-inbox' text='Inbox' color='blue'/>
                </li>
                <li>
                    <TaskItem icon='far fa-star' text='Starred' color='red'/>
                </li>
                <li className='tasksList--active'>
                    <TaskItem icon='fas fa-user-friends' text='Lista compra carrefour'/>
                </li>
                <li>
                    <TaskItem icon='fas fa-user-friends' text='Lista de la compra'/>
                </li>
                <li>
                    <TaskItem icon='fas fa-user-friends' text='Livi'/>
                </li>
                <li>
                    <TaskItem icon='fas fa-user-friends' text='Películas para ver'/>
                </li>
                <li>
                    <TaskItem icon='fas fa-list' text='Prueba'/>
                </li>
            </ul>
        );
    };
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