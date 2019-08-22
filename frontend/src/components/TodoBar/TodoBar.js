/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight';
import { actions } from '../../store/Store';
/* Import css */
import './TodoBar.css';

class TodoBarAux extends React.Component {
  
    constructor(props) {
        // Superclass constructors
        super(props);
        // Events
        this.addTodo = this.addTodoEventHandler.bind(this);
        // State
        this.state = {
            focus: false,
            starred: false,
            input: '',
        }
    }

    render() {
        return (
            <div className='addTask'>
                <div className='addTask-actions--left'>
                    { this.state.focus && <ButtonLight className='btn' color='white' icon='fas fa-microphone'/> }
                    { !this.state.focus && <ButtonLight className='btn' color='white' icon='fa fa-plus' onClick={this.addTodo}/> } 
                </div>
                <div className='addTask-actions--right'>
                    <ButtonLight className='btn' color='white' icon='fa fa-calendar-alt'/>
                    <ButtonLight className='btn' color='white' icon={this.state.starred?'fas fa-star':'far fa-star'} onClick={ev=>this.setState({starred: !this.state.starred})} />
                </div>
                <input  type='text'
                        className='addTask-input' 
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

    async addTodoEventHandler(ev) {
        if (this.state.input === '') {
            this.setState({focus: true});
        } else {
            try {
                let result = await Axios.post(`/tasklists/tasks`, null, {
                    headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: {
                        id: this.props.list.id,
                        description: this.state.input,
                        starred: this.state.starred,
                    }
                });
                if (result.status === 200) {
                    this.props.addTodo(result.data.result);
                }
                this.setState({
                    input: '',
                    starred: false
                });
            } catch (error) {
                console.log(error)
            }
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user,
        list: state.selected,
        switch: state.switch,
    };
};
const mapActions = { 
    addTodo: actions.addTodo,
};


const TodoBar = connect(mapState, mapActions)(TodoBarAux);
export default TodoBar;