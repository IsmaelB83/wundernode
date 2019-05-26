/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight'
/* Import css */
import './AddTaskBar.css';

export default class AddTaskBar extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
    }

    render() {
        return (
            <div className='addTask'>
                <div className='addTask-actions--left'>
                    <ButtonLight className='btn' color='white' icon={this.state.focus?'fas fa-microphone':'fa fa-plus'}/>
                </div>
                <div className='addTask-actions--right'>
                    <ButtonLight className='btn' color='white' icon='fa fa-calendar-alt'/>
                    <ButtonLight className='btn' color='white' icon='fa fa-star'/>
                </div>
                <input  className='addTask-input' 
                        placeholder='Add a to-do...' 
                        onFocus={()=>{this.setState({focus:true})}}
                        onBlur={()=>{this.setState({focus:false})}}
                >
                </input>
            </div>
        );
    };
}