/* Import node modules */
import React from 'react';
/* Import own modules */
import './Inputs.css';

export default class InputIcon extends React.Component {
    render() {
        return (
            <div className={`inputicon-group ${this.props.size==='lg'?'inputicon-group--lg':''}`}>
                <i className={`inputicon-icon ${this.props.icon}`}></i>
                <input className={`inputicon-input ${this.props.input}`} placeholder={this.props.placeholder}></input>
            </div>
        );
    };
}