/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../../components/Buttons/ButtonLight/ButtonLight';
/* Import css */
import './TodoBar.css';


/**
 * Componente para la barra de tareas de un nuevo todo
 */
export default class TodoBar extends React.Component {
  
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.addTodo = this.addTodoEventHandler.bind(this);
        this.state = {
            focus: false,
            starred: false,
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <div className='TodoBar'>
                <div className='TodoBar-actions--left'>
                    { this.state.focus && <ButtonLight className='btn' color='white' icon='fas fa-microphone'/> }
                    { !this.state.focus && <ButtonLight className='btn' color='white' icon='fa fa-plus' onClick={this.addTodo}/> } 
                </div>
                <div className='TodoBar-actions--right'>
                    <ButtonLight className='btn' color='white' icon='fa fa-calendar-alt'/>
                    <ButtonLight className='btn' color='white' icon={this.state.starred?'fas fa-star':'far fa-star'} onClick={ev=>this.setState({starred: !this.state.starred})} />
                </div>
                <input  type='text'
                        className='TodoBar-input' 
                        placeholder={`Add a to-do to ${this.props.taskList && this.props.taskList.system?'in "Inbox"':''}`}
                        onFocus={()=>{this.setState({focus:true})}}
                        onBlur={()=>{this.setState({focus:false})}}
                        value={this.state.input}
                        onChange={ev => { this.setState({input: ev.target.value})}}
                        onKeyPress={ev => { if(ev.key==='Enter') { this.addTodo() }}}
                >
                </input>
            </div>
        );
    };

    /**
     * Propaga el evento al container para que gestione el nuevo todo
     */
    addTodoEventHandler() {
        if (this.state.input.length > 0) {
            this.props.addTodo(this.state.input);
            this.setState({
                focus: false,
                input: ''
            });
        }
    }
}