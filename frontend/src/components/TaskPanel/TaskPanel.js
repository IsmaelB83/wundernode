/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
import Task from '../Task/Task';
/* Import css*/
import './TaskPanel.css';

class TaskPanelAux extends React.Component {

    render() {
        return (
            <ul className='tasklist'>
            {   this.props.lists.length > 0 && 
                this.props.lists.map((value, index) => {
                    return  <li key={index} 
                                className={`tasklist-li ${index===this.props.selected?'tasklist-li--active':''}`}
                                onClick={this.taskListClick.bind(this)} 
                                data-index={index}
                            >
                                <Task   id={value._id} 
                                        icon={value.icon} 
                                        text={value.description} 
                                        color={value.color}
                                        starred={value.starred.length}
                                        tasks={value.tasks.length}
                                        active={index===this.props.selected?true:false}
                                />
                            </li>
                })
            }
            </ul>
        );
    };

    async taskListClick(ev) {
        ev.preventDefault();
        let index = ev.currentTarget.dataset.index
        let taskList = this.props.lists[index];
        let url = '/tasklist/task/'
        /* Las búsquedas de todos de las listas de sistema son una excepción */
        switch (taskList.systemId) {
            case 1:   url += 'starred';     break;
            case 2:   url += 'today';       break;
            case 3:   url += 'week';        break;
            default:  url += taskList._id;
        }
        let response = await fetch(url);
        if (response.status === 200) {
            let json = await response.json();
            if (json) {
                this.props.loadList(parseInt(index), taskList, json.result); 
            }
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
        selected: state.selected,
        lists: state.lists,
        switch: state.switch,
    };
};

const mapActions = { 
    loadList: actions.loadList 
};

const TaskPanel = connect(mapState, mapActions)(TaskPanelAux);
export default TaskPanel;