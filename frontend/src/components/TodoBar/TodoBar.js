/* Import node modules */
import React from 'react';
import Modal from 'react-awesome-modal';
import DateTimePicker from 'react-datetime-picker';
/* Import own modules */
import ButtonLight from '../../components/Buttons/ButtonLight/ButtonLight';
import ButtonBase from '../../components/Buttons/ButtonBase/ButtonBase';
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
        modal: false,
        due: null,
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
                    <ButtonLight className='btn' color='white' icon={this.state.due?'far fa-calendar-check':'far fa-calendar'} onClick={ev=>this.setState({modal: true})}/>
                    <ButtonLight className='btn' color='white' icon={this.state.starred?'fas fa-star':'far fa-star'} onClick={ev=>this.setState({starred: !this.state.starred})} />
                </div>
                <input  type='text'
                        className='TodoBar-input' 
                        placeholder={`Add a to-do to...`}
                        value={this.state.input}
                        onChange={ev => { this.setState({input: ev.currentTarget.value})}}
                        onKeyPress={ev => { if(ev.key==='Enter') { this.addTodoEventHandler() }}}
                >
                </input>
                {/* Modal para indicar vencimiento de tarea*/}
                <Modal visible={this.state.modal} width="400" effect="fadeInDown" onClickAway={()=>this.setState({modal: !this.state.modal, due: null})}>
                <div className='popup-wrapper'>
                    <div className='popup-header'>
                        <h3 className='popup-title'>Fecha de vencimiento</h3>
                        <DateTimePicker onChange={date=>this.setState({due: date})} value={this.state.due}/>
                    </div>
                    <div className='popup-footer'>
                        <ButtonBase onClick={()=>this.setState({modal: false, due: null})} text='Cancel' className='mr-2' />
                        <ButtonBase onClick={()=>this.setState({modal: false})} text='Save' color='lightblue'/>
                    </div>
                </div>
            </Modal>
            </div>
        );
    };

    /**
     * Propaga el evento al container para que gestione la creación del todo
     */
    addTodoEventHandler = () => {
        const value = this.state.input.trim();
        if (value!=='') {
            this.props.todoAddEventHandler(value, this.state.starred, this.state.due);
            this.setState({input: '', starred: false, due: null});
        }
    }
}