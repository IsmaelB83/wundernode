/* Import node modules */
import React from 'react';
import Moment from 'react-moment';
/* Import own modules */
/* Import own css */
import './Todo.css';

/**
 * To-do component
 */
export default class Todo extends React.Component {

    /**
     * Render
     */
    render() {
        return (
            <div className={`Todo ${this.props.active?'Todo--active':''}`}>
                <a href='/' className='Todo-check' onClick={this.doneEventHandler}>
                    <i className={`far ${this.props.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`Todo-nameWrapper ${this.props.completed?'Todo--done':''}`}>
                    <span className='Todo-name'>{this.props.text}</span>
                    { this.props.completed && <small className='Todo-done'>
                            <Moment fromNow>{this.props.closedAt}</Moment> by {this.props.closedBy.name || 'error'}
                    </small> }
                </div>
                { !this.props.completed && this.props.due && 
                    <span className={`Todo-due ${Date.parse(this.props.due)<Date.now()?'Todo-due--overdue':''}`}>
                        <Moment fromNow>{this.props.due}</Moment>
                    </span> }
                <div className={`Todo-star ${this.props.starred?'Todo-star--starred':''}`}>
                    <a href='/' onClick={this.starredEventHanlder}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };

    /**
     * To-Do set as high importance
     * @param {Event} ev Evento que genera el click 
     */
    starredEventHanlder = (ev) => {
        ev.preventDefault();
        if (!this.props.completed) {
            this.props.todoStarredEventHanlder(this.props.id, !this.props.starred);
        }
    }

    /**
     * To-Do set as completed
     * @param {Event} ev Evento que genera el click 
     */
    doneEventHandler = (ev) => {
        ev.preventDefault();
        this.props.todoCompleteEventHandler(this.props.id, !this.props.completed, this.props.starred);
    }
}