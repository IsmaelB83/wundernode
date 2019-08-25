/* Import node modules */
import React from 'react';
/* Import own modules */
import '../Button.css';
import './ButtonBase.css';


/**
 * Boton básico de la aplicación
 */
export default class ButtonBase extends React.Component {
    
    /**
     * Render
     */
    render() {
        return (
            <button className={`ButtonBase ${this.props.className} Button--${this.props.color}`} 
                    onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    };
}