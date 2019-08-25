/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
/* Import own modules */
import { Config } from '../../config';
import { actions } from '../../store/Store';
import Task from '../../components/Task/Task';
/* Import css*/
import './TaskPanel.css';

/**
 * Panel de listas de tareas
 */
class TaskPanelAux extends React.Component {

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
        };
    }
    
    /**
     * Renderiza el componente
     */
    render() {
        return (
            <ul className='tasklist'>
            {   this.props.lists.length > 0 && 
                this.props.lists.map((value, index) => {
                    return  <li key={index} 
                                className={`tasklist-li ${index===this.state.selected?'tasklist-li--active':''}`}
                                onClick={this.taskListClick.bind(this)} 
                                data-index={index}
                                data-id={value.id}
                            >
                                <Task   id={value.id} 
                                        data-index={index}
                                        icon={Config.lists.icon} 
                                        text={value.description} 
                                        color={Config.lists.color}
                                        starred={value.starred}
                                        tasks={value.tasks}
                                        active={index===this.props.selected?true:false}
                                />
                            </li>
                })
            }
            </ul>
        );
    };

    /**
     * Cuando se hace click en una lista se cargan sus tareas en el estado
     * @param {Event} ev 
     */
    async taskListClick(ev) {
        try {
            ev.preventDefault();
            const index = parseInt(ev.currentTarget.dataset.index);
            const response = await Axios.get(`/tasklists/${ev.currentTarget.dataset.id}`, { headers: { 'Authorization': "bearer " + this.props.user.token } });
            if (response.status === 200) {
                this.setState({selected: index});
                this.props.loadList(response.data.result);
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
        lists: state.lists,
        switch: state.switch
    };
};

const mapActions = { 
    loadList: actions.loadList 
};

const TaskPanel = connect(mapState, mapActions)(TaskPanelAux);
export default TaskPanel;