/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
import Todo from '../Todo/Todo';
/* Import own css */
import './TodoPanel.css';


class TodoPanelAux extends React.Component { 

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <ol id={this.props.id} className={`todoList ${this.props.completed?'todoList--done':''}`}>
            { this.props.todos && 
                ( ( this.props.completed && this.props.showCompleted ) || !this.props.completed ) && 
                this.props.todos.map((todo, index) => {
                    if (todo.completed === this.props.completed) {
                        return <li  key={index} data-index={index}
                                    onClick={ev => { this.setState({ selected: parseInt(ev.currentTarget.dataset.index) })}}>
                                    <Todo   text={todo.description} 
                                            active={this.state.selected===index?true:false} 
                                            starred={todo.starred}
                                            completed={todo.completed} 
                                            id={todo.id}
                                    />
                                </li>
                    } else {
                       return '';
                    }
                })
            }
            </ol>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user,
        todos: state.selected.tasks,
        switch: state.switch
    };
};

const mapActions = { 
    reloadList: actions.reloadList,
};

const TodoPanel = connect(mapState, mapActions)(TodoPanelAux);
export default TodoPanel;