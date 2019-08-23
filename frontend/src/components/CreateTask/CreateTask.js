/* Import node modules */
import React from 'react';
import Modal from 'react-awesome-modal';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import InputIcon from '../Inputs/InputIcon';
import ButtonBase from '../Buttons/ButtonBase';
import { actions } from '../../store/Store';
/* Import own css */
import './CreateTask.css';

/**
 * 
 */
class CreateTaskAux extends React.Component {

    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        // Superclass
        super(props);
        // Event handlers
        this.createList = this.createListEventHandler.bind(this);
        // Estado
        this.state = {
            popup : false,
            taskListName: '',
        }
    }

    render() {
        return (
            <div className='createbutton'>
                <button className='createbutton-link' href='' onClick={ev => this.setState({popup: true})}>
                    <i className='fa fa-plus'></i>Create List
                </button>               
                <Modal visible={this.state.popup} width="400" effect="fadeInDown" onClickAway={ev => this.setState({popup: false})}>
                    <div className='popup-wrapper'>
                        <div className='popup-header'>
                            <h3 className='popup-title'>Create New List</h3>
                            <input className='popup-input popup-input--block' 
                                   placeholder='List Name'
                                   onChange={ev=>this.setState({taskListName: ev.currentTarget.value})}
                                   onKeyPress={(ev) => { if(ev.key==='Enter') { this.createList()}}}
                            />
                        </div>
                        <div className='popup-body'>
                            <div className='tab-panel'>
                                <div className='tab-options'>
                                    <span>List members</span>
                                </div>
                                <div className='tab-members'>
                                    <InputIcon  input='popup-input popup-input--block' 
                                                icon='fas fa-user-plus' 
                                                placeholder='Name or email address...'
                                                size='lg'/>
                                    <div className='popup-owner'>   
                                        <img src={this.props.user.avatar} alt="avatar"></img>
                                        <span>{this.props.user.name}</span>
                                    </div>                                                
                                </div>
                            </div>
                        </div>
                        <div className='popup-footer'>
                            <ButtonBase className='mr-2' onClick={ev => this.setState({popup: false})} text='Cancel'/>
                            <ButtonBase onClick={this.createList} text='Save' color='lightblue'/>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    };

    async createListEventHandler() {
        try {
            if (this.state.taskListName) {
                const result = await Axios.post('/tasklists', null, { headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: { description: this.state.taskListName }
                });
                if (result.status === 200) {
                    this.props.addTaskList(result.data.result);
                    this.setState({
                        taskListName: '',
                        popup: false
                    });
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Autocompletar miembros posibles para la lista
     * @param {Event} ev Evento generado
     */
    async autocompleteMemberEventHandler(ev) {
        try {
            
        } catch (error) {
            
        }
    }

    /**
     * Añadir un miembro a la lista
     * @param {Event} ev Evento generado
     */
    async addMemberEventHandler(ev) {
        try {
            
        } catch (error) {
            
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
    addTaskList: actions.addTaskList,
};


const CreateTask = connect(mapState, mapActions)(CreateTaskAux);
export default CreateTask;