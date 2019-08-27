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
     * Initial state
     */
    state = { 
        starred: false,
        input: ''
     }

    /**
     * Render
     */
    render() {
        return (
            <div className='TodoBar'>
                <div className='TodoBar-actions--left'>
                    <ButtonLight className='btn' color='white' icon='fa fa-plus' onClick={this.addTodoEventHandler}/>
                </div>
                <div className='TodoBar-actions--right'>
                    <ButtonLight className='btn' color='white' icon='fa fa-calendar-alt' onClick={ev=>alert('Not implemented yet')}/>
                    <ButtonLight className='btn' color='white' icon={this.state.starred?'fas fa-star':'far fa-star'} onClick={ev=>this.setState({starred: !this.state.starred})} />
                </div>
                <input  type='text'
                        className='TodoBar-input' 
                        placeholder={`Add a to-do to ${this.props.taskList && this.props.taskList.system?'in "Inbox"':''}`}
                        value={this.state.input}
                        onChange={ev => { this.setState({input: ev.currentTarget.value})}}
                        onKeyPress={ev => { if(ev.key==='Enter') { this.addTodoEventHandler() }}}
                >
                </input>
            </div>
        );
    };

    /**
     * Propaga el evento al container para que gestione la creación del todo
     */
    addTodoEventHandler = () => {
        const value = this.state.input.trim();
        if (value!=='') {
            this.props.todoAddEventHandler(value, this.state.starred);
            this.setState({input: '', starred: false});
        }
    }
}