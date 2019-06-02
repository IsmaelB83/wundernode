/* Import node modules */
import React from 'react';
/* Import own modules */
/* Import css*/
import './Task.css';

export default class Task extends React.Component {

    render() {
        return (           
            <div className='task'>
                <a href='/' className='task-name'>
                    <i className={`task-icon ${this.props.color} ${this.props.icon}`}></i>
                    {this.props.text}
                </a>
                <div className='task-badges'>
                    { this.props.starred > 0 && <span className='badge badge-pill badge--danger'>{this.props.starred}</span> }
                    { this.props.tasks > 0 && <span className='badge badge-pill badge--secondary'>{this.props.tasks}</span> }
                </div>
            </div>
        );
    };
}