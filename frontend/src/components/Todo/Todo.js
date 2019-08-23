/* Import node modules */
import React from 'react';
import Axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
/* Import own modules */
import { Config } from '../../config';
import { actions } from '../../store/Store';
/* Import own css */
import './Todo.css';

// Completed audio
const audio = new Audio(`${process.env.PUBLIC_URL}${Config.sounds.completed}`);

class TodoAux extends React.Component {

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        // Handlers
        this.starredEvent = this.starredEventHanlder.bind(this);
        this.doneEvent = this.completeEventHandler.bind(this);
        // State
        this.state = {
            selected: 0,
            completed: this.props.completed,
            starred: this.props.starred
        }
    }

    render() {
        return (
            <div className={`todo ${this.props.active?'todo--active':''}`}>
                <a href='/' className='todo-check' onClick={this.doneEvent}>
                    <i className={`far ${this.state.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`todo-nameWrapper ${this.props.completed?'todo--done':''}`}>
                    <span className='todo-name'>{this.props.text}</span>
                    {this.props.completed && <small className='todo-done'>a few seconds ago by ismael</small>}
                </div>
                {this.props.due && <span className='todo-due'>{moment(this.props.due).format('L')}</span>}
                <div className={`todo-star ${this.state.starred?'todo-star--starred':''}`}>
                    <a href='/' onClick={this.starredEvent} data-id={this.props.id}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };

    async starredEventHanlder(ev) {
        try {
            ev.preventDefault();
            if (!this.state.completed) {
                // Call API to starred task
                let result = await Axios.put(`/tasklists/tasks/${this.props.id}/star`, null, {
                    headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: { starred: !this.state.starred }
                });
                if (result.status === 200) {
                    this.setState({starred: !this.state.starred});
                    this.props.starTodo(this.props.id, this.state.starred);
                }
            }
        } catch (error) {
            console.log(error)
        }   
    }

    async completeEventHandler(ev) {
        try {
            // Call API to complete task
            ev.preventDefault();
            // Call API to starred task
            let result = await Axios.put(`/tasklists/tasks/${this.props.id}/complete`, null, {
                headers: { 'Authorization': "bearer " + this.props.user.token },
                data: { completed: !this.state.completed }
            });
            if (result.status === 200) {
                audio.currentTime = 0; 
                audio.play();     
                this.setState({completed: !this.state.completed})
                this.props.completeTodo(this.props.id, this.state.completed, this.state.starred);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user,
    };
};

const mapActions = { 
    starTodo: actions.starTodo,
    completeTodo: actions.completeTodo,
};

const Todo = connect(mapState, mapActions)(TodoAux);
export default Todo;