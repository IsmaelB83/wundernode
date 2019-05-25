/* Import node modules */
import React from 'react';
/* Import own modules */
import './Inputs.css';

export default class InputIcon extends React.Component {
    render() {
        return (
            <div className="inputGroup">
                <button className="boton--light"><i class="fas fa-search"></i></button>
                <input className="input--transparent" placeholder="search..."></input>
            </div>
        );
    };
}