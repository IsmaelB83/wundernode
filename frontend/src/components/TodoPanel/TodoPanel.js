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
            { this.props.selected.tasks && 
                ( ( this.props.completed && this.props.showCompleted ) || !this.props.completed ) && 
                this.props.selected.tasks.map((value, index) => {
                    if (value.completed === this.props.completed) {
                        return <li  key={index} data-index={index}
                                    onClick={ev => { this.setState({ selected: parseInt(ev.currentTarget.dataset.index) })}}>
                                    <Todo   text={value.description} 
                                            active={this.state.selected===index?true:false} 
                                            starred={value.starred}
                                            completed={value.completed} 
                                            id={value._id}
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
        selected: state.selected,
        switch: state.switch
    };
};

const mapActions = { 
    reloadList: actions.reloadList,
};

const TodoPanel = connect(mapState, mapActions)(TodoPanelAux);
export default TodoPanel;