/* Import node modules */
import React from 'react';
/* Import own modules */
import './Buttons.css';

export default class ButtonHeading extends React.Component {
    
    render() {
        return (
            <a href='/' className='buttonHeading button--blue mt-2'>Show completed to-dos</a>
        );
    };
    
}