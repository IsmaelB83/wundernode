/* Import node modules */
import React from 'react';
import moment from 'moment';
/* Import own css */
import './Todo.css';

const audio = new Audio(`${process.env.PUBLIC_URL}/audio/completed.ogg`);

export default class Todo extends React.Component {

    render() {
        return (
            <div className={`todo ${this.props.active?'todo--active':''}`}>
                <a href='/' className='todo-check' onClick={this.setTodoDone.bind(this)}>
                    <i className={`far ${this.props.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`todo-nameWrapper ${this.props.completed?'todo--done':''}`}>
                    <span className='todo-name'>{this.props.text}</span>
                    {this.props.completed && <small className='todo-done'>a few seconds ago by ismael</small>}
                </div>
                {this.props.due && <span className='todo-due'>{moment(this.props.due).format('L')}</span>}
                <div className={`todo-star ${this.props.star?'todo-star--starred':''}`}>
                    <a href='/' onClick={this.props.starredClick} data-index={this.props.index}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };

    async setTodoDone(ev) {
        try {
            ev.preventDefault();
            audio.play();               
        } catch (error) {
            console.log(error);
        }
    }
}