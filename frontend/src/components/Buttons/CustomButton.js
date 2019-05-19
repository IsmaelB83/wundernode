/* Import node modules */
import React from 'react';
/* Import own modules */
import './CustomStyles.css';

export default class CustomButton extends React.Component {
  
    render() {
        return (
            <button className={this.props.className} size={this.props.size}>{this.props.title}</button>
        );
    };
}