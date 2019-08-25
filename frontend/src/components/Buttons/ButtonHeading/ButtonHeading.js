/* Import node modules */
import React from 'react';
/* Import own modules */
import '../Button.css';
import './ButtonHeading.css';


/**
 * Boton cabecera
 */
export default class ButtonHeading extends React.Component {
    
    render() {
        return (
            <button className='ButtonHeading Button--blue' onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    };
    
}