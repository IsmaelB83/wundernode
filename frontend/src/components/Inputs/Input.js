/* Import node modules */
import React from 'react';
/* Import own modules */
import './Input.css';


/**
 * Componente de input field
 */
export default class Input extends React.Component {
    
    /**
     * Render
     */
    render() {
        return (
            <div className={`Input ${this.props.size==='lg'?'Input--lg':''}`}>
                <i className={`Input-icon ${this.props.icon}`}></i>
                <input className={`Input-input ${this.props.input}`} placeholder={this.props.placeholder}
                    type={this.props.type} name={this.props.name} required={this.props.required||false}
                    autoComplete={this.props.autoComplete} onChange={this.props.onChange}>
                </input>
            </div>
        );
    };
}