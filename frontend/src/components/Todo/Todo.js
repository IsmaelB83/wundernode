/* Import node modules */
import React from 'react';
import moment, { version } from 'moment';
/* Import own modules */
/* Import own css */
import './Todo.css';

/**
 * Todo component
 */
export default class Todo extends React.Component {

    render() {
        return (
            <div className={`Todo ${this.props.active?'Todo--active':''}`}>
                <a href='/' className='Todo-check' onClick={this.complete}>
                    <i className={`far ${this.props.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`Todo-nameWrapper ${this.props.completed?'Todo--done':''}`}>
                    <span className='Todo-name'>{this.props.text}</span>
                    { this.props.completed && <small className='Todo-done'>a few seconds ago by ismael</small> }
                </div>
                { this.props.due && <span className='Todo-due'>{moment(this.props.due).format('L')}</span> }
                <div className={`Todo-star ${this.props.starred?'Todo-star--starred':''}`}>
                    <a href='/' onClick={this.star} data-id={this.props.id}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };

    star = (ev) => {
        ev.preventDefault();
        if (!this.props.completed) {
            this.props.onStarred(this.props.id, !this.props.starred);
        }
    }

    complete = (ev) => {
        ev.preventDefault();
        this.props.onDone(this.props.id, !this.props.completed, this.props.starred);
    }
}