/* Import node modules */
import React from 'react';
/* Import own modules */
/* Import css*/
import './Task.css';

export default class Task extends React.Component {

    render() {
        return (           
            <div className='taskitem'>
                <a href='/' className='taskitem-name'>
                    <i className={`taskitem-icon ${this.props.color} ${this.props.icon}`}></i>
                    {this.props.text}
                </a>
                <div className='taskitem-badges'>
                    { this.props.starred > 0 && <span className={`badge badge-pill badge-starred ${this.props.active?'badge-starred--active':''}`}>{this.props.starred}</span> }
                    { this.props.tasks > 0 && <span className={`badge badge-pill badge-normal ${this.props.active?'badge-normal--active':''}`}>{this.props.tasks}</span> }
                </div>
            </div>
        );
    };
}