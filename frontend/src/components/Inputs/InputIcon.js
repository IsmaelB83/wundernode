/* Import node modules */
import React from 'react';
/* Import own modules */
import './Inputs.css';

export default class InputIcon extends React.Component {
    render() {
        return (
            <div className={`input_icon ${this.props.size==='lg'?'input_icon--lg':''}`}>
                <i className={`input_icon-icon ${this.props.icon}`}></i>
                <input className={`input_icon-input ${this.props.input}`} placeholder={this.props.placeholder}
                    type={this.props.type} name={this.props.name} required={this.props.required||false}
                    onChange={this.props.onChange}>
                </input>
            </div>
        );
    };
}