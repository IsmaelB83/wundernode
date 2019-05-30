/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import './TodoList.css';

class TodoListAux extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    render() {
        return (
            <ol id={this.props.id} className={`todoList ${this.props.completed?'todoList--done':''}`}>
            { this.props.tasks && 
                this.props.tasks.map((value, index) => {
                    if (value.completed === this.props.completed) {
                        return <li key={index} onClick={this.clickLine.bind(this)} data-index={index}>
                                    <TodoItem text={value.description} 
                                            completed={value.completed} 
                                            active={this.state.selected===index?true:false} 
                                            star={value.starred}/>
                                </li>
                    }
                })
            }
            </ol>
        );
    };

    clickLine(ev) {
        this.setState({selected: parseInt(ev.currentTarget.dataset.index)});
        console.log(this.state);
    }
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

// React-Redux
const mapState = (state) => { 
    return { 
        tasks: state.tasks
    };
};
const TodoList = connect(mapState, null)(TodoListAux);
export default TodoList;