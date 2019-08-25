/* Import node modules */
import React from 'react';
/* Import own modules */
import '../Button.css';
import './ButtonLight.css';


/**
 * Boton con fondo transparente y con icono
 */
export default class ButtonLight extends React.Component {
    
    render() {
        return (
            <button className={`ButtonLight ${this.props.className} Button--${this.props.color}`} onClick={this.props.onClick}>
                <i className={this.props.icon}>
                    {this.props.span && <span>{this.props.span}</span>}
                </i>
            </button>
        );
    };
    
}