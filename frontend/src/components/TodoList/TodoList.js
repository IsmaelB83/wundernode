/* Import node modules */
import React from 'react';
/* Import own modules */
import './TodoList.css';

export default class TodoList extends React.Component { 
    render() {
        return (
            <ol id={this.props.id} className={`todoList ${this.props.completed?'todoList--done':''}`}>
                <li>
                    <TodoItem text='Comprar leche' completed={this.props.completed} active={true} star={true}/>
                </li>
                <li>
                    <TodoItem text='Comprar coca cola' completed={this.props.completed}/>
                </li>
                <li>
                    <TodoItem text='Comprar nutella' completed={this.props.completed}/>
                </li>
            </ol>
        );
    };
}

class TodoItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            star: this.props.star
        };
    }

    render() {
        return (
            <div className={`todo ${this.props.active?'todo--active':''}`}>
                <a href='/' className='todo-check'>
                    <i className={`far ${this.props.completed?'fa-check-square':'fa-square'}`}></i>
                </a>
                <div className={`todo-nameWrapper ${this.props.completed?'todo--done':''}`}>
                    <span className='todo-name'>{this.props.text}</span>
                    {this.props.completed && <small className='todo-done'>a few seconds ago by ismael</small>}
                </div>
                <div className={`todo-star ${this.state.star?'todo-star--starred':''}`}>
                    <a href='/' onClick={() => {this.setState({star: !this.state.star})}}>
                        <img className='starImg' src={`${process.env.PUBLIC_URL}/img/star.png`} alt='star'></img>
                    </a>            
                </div>
            </div>
        );
    };
}