/* Import node modules */
import React from 'react';
/* Import own modules */
/* Import css*/
import './Task.css';


/**
 * Componente para pintar una TaskList
 */
export default class Task extends React.Component {

    /**
     * Render
     */
    render() {
        return (           
            <div className='Task'>
                <a href='/' className='Task-name'>
                    <i className={`Task-icon ${this.props.color} ${this.props.icon}`}></i>
                    {this.props.text}
                </a>
                <div className='Task-badges'>
                    { this.props.starred > 0 && <span className={`badge badge-pill badge-starred ${this.props.active?'badge-starred--active':''}`}>{this.props.starred}</span> }
                    { this.props.tasks > 0 && <span className={`badge badge-pill badge-normal ${this.props.active?'badge-normal--active':''}`}>{this.props.tasks}</span> }
                </div>
            </div>
        );
    };
}