/* Import node modules */
import React from 'react';
/* Import own modules */
import './Buttons.css';

export default class ButtonHeading extends React.Component {
    
    render() {
        return (
            <button className='buttonHeading button--blue mt-2' onClick={this.props.onClick}>Show completed to-dos</button>
        );
    };
    
}