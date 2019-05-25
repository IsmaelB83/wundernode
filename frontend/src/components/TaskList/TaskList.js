/* Import node modules */
import React from 'react';
/* Import own modules */
import './TaskList.css';

export default class TaskList extends React.Component {
  
    render() {
        return (
            <div className="taskslist">
                <ul>
                    <li>
                        <TaskItem icon="fa-inbox" text="Inbox"/>
                    </li>
                    <li className="list--active">
                        <TaskItem icon="fa-user-friends" text="Lista compra carrefour"/>
                    </li>
                    <li>
                        <TaskItem icon="fa-user-friends" text="Lista de la compra"/>
                    </li>
                    <li>
                        <TaskItem icon="fa-user-friends" text="Livi"/>
                    </li>
                    <li>
                        <TaskItem icon="fa-user-friends" text="Películas para ver"/>
                    </li>
                    <li>
                        <TaskItem icon="fa-user-friends" text="Amazón"/>
                    </li>
                </ul>
            </div>
        );
    };
}

class TaskItem extends React.Component {
    render() {
        return (
            <button>
                <i className={`fas ${this.props.icon}`}></i>
                {this.props.text}
            </button>
        );
    };
}