/* eslint-disable jsx-a11y/anchor-is-valid */
/* Import node modules */
import React from 'react';
import Modal from 'react-awesome-modal';
import Axios from 'axios';
/* Import own modules */
//import InputIcon from '../Inputs/InputIcon';
import ButtonBase from '../Buttons/ButtonBase';
/* Import own css */
import './CreateTask.css';

export default class CreateTask extends React.Component {

    constructor(props) {
        super(props);
        this.save = React.createRef();
        this.input = React.createRef();
        this.state = {
            popup : false
        }
    }

    render() {
        return (
            <div className='createbutton'>
                <button className='createbutton-link' href='' onClick={this.openModal.bind(this)}>
                    <i className='fa fa-plus'></i>Create List
                </button>               
                <Modal visible={this.state.popup} width="400" effect="fadeInDown" onClickAway={() => this.closeModal()}>
                    <div className='popup-wrapper'>
                        <div className='popup-header'>
                            <h3 className='popup-title'>Create New List</h3>
                            <input ref={this.input}
                                   className='popup-input popup-input--block' 
                                   placeholder='List Name'
                                   onChange={(ev) => { this.save.current.enable(ev.currentTarget.value==='')}}
                                   onKeyPress={(ev) => { if(ev.key==='Enter') { this.closeModal(); this.CreateTask()}}}
                            />
                        </div>
                        {/* 
                        <div className='popup-body'>
                            <div className='tab-panel'>
                                <div className='tab-options'>
                                    <a href=''>List members</a>
                                    <a href=''>List options</a>
                                </div>
                                <div className='tab-members'>
                                    <InputIcon  input='popup-input popup-input--block' 
                                                icon='fas fa-user-plus' 
                                                placeholder='Name or email address...'
                                                size='lg'/>
                                    <div className='popup-owner'>   
                                        <div className='owner-avatar'>
                                            <img src="http://www.jackedandstrong.com/wp-content/uploads/2016/08/Avatar-Facebook-1.jpg" alt="avatar"/>
                                        </div>
                                        <div>
                                        </div>
                                    </div>                                                
                                </div>
                            </div>
                        </div>
                        */}
                        <div className='popup-footer'>
                            <ButtonBase className='mr-2' onClick={this.closeModal.bind(this)} text='Cancel'/>
                            <ButtonBase ref={this.save} onClick={this.createList.bind(this)} text='Save' color='lightblue' disabled={true}/>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    };

    openModal() {
        this.setState({popup: true});
    }
 
    closeModal() {
        this.setState({popup: false});
    }

    async createList() {
        let listName = this.input.current.value;
        if (listName !== '') {
            try {
                let result = await Axios.post(`/tasklist`, null, {
                    data: {
                        description: listName,
                        icon: 'fas fa-user-friends',
                    }
                });
                if (result.status === 200) {
                    alert('Lista creada con éxito');
                }
                this.input.current.value = '';
            } catch (error) {
                console.log(error)
            }
        }
    }

}