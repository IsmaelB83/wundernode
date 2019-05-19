/* Import node modules */
import React from 'react';
/* Import own modules */
import './CustomStyles.css';

export default class CustomLink extends React.Component {
  
    render() {
        return (
            <a  href={this.props.href} 
                className={this.props.className} 
                onClick={this.props.onClick}>
                {this.props.title}
            </a>
        );
    };
}