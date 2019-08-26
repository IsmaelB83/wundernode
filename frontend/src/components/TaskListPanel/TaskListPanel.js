/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import { Config } from '../../config';
import TaskList from '../TaskList/TaskList';
/* Import css*/
import './TaskListPanel.css';


/**
 * Panel de listas de tareas
 */
export default class TaskListPanel extends Component {

    /**
     * Initial state
     */
    state = { selected: 0 };

    /**
     * Renderiza el componente
     */
    render() {
        return (
            <ul className='TaskListPanel'>
            {   this.props.lists.length > 0 && 
                this.props.lists.map((value, index) => {
                    return  <li key={index} 
                                className={`TaskListPanel-li ${index===this.state.selected?'TaskListPanel-li--active':''}`}
                                onClick={this.taskListSelectedEventHandler} 
                                data-index={index}
                                data-id={value.id}
                            >
                                <TaskList   id={value.id} 
                                            data-index={index}
                                            icon={Config.lists.icon} 
                                            text={value.description} 
                                            color={Config.lists.color}
                                            starred={value.starred}
                                            tasks={value.tasks}
                                            active={index===this.state.selected}
                                />
                            </li>
                })
            }
            </ul>
        );
    };

    /**
     * Cuando se pincha en una lista
     */
    taskListSelectedEventHandler = (ev) => {
        ev.preventDefault();
        this.setState({selected: parseInt(ev.currentTarget.dataset.index)});
        this.props.taskListSelectedEventHandler(ev.currentTarget.dataset.id);
    }
}