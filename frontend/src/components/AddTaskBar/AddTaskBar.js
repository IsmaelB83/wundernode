/* Import node modules */
import React from 'react';
/* Import own modules */
import './AddTaskBar.css';

export default class AddTaskBar extends React.Component {
  
    render() {
        return (
            <div className="addTask">
                <button className="btn boton--light addTask-btn"><i class="fa fa-plus"></i></button>
                <div className="addTask-actions addTask-actions--right">
                    <button className="btn boton--light"><i class="far fa-calendar-alt"></i></button>
                    <button className="btn boton--light"><i class="far fa-star"></i></button>
                </div>
                <input className="input--button" placeholder="Add a to-do..."></input>
            </div>
        );
    };
}