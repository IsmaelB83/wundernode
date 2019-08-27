/* Import node modules */
import React from 'react';
import Modal from 'react-awesome-modal';
import Autosuggest from 'react-autosuggest';
/* Import own modules */
import ButtonBase from '../../components/Buttons/ButtonBase/ButtonBase';
import MemberResult from '../../components/MemberResult/MemberResult';
/* Import own css */
import './ModalTaskList.css';
     

/**
* Popup modal para compartir una lista de tareas con tus amigos
*/
export default class ModalTaskList extends React.Component {
    
    /**
    * Constructor
    * @param {*} props 
    */
    constructor(props) {
        // Superclass
        super(props);
        // Estado
        this.state = {
            newMembers: [],
            value: '',
            suggestions: []
        }
    }

    /**
     * Cambio en el input de invitar miembro (autosuggest input)
     */
    onChange = (event, { newValue }) => this.setState({value: newValue});

    /**
     * Autossugestions will call this function every time the suggestions are cleared
     */
    onSuggestionsClearRequested = () => this.setState({suggestions: []});
    
    /**
     * Autossugestions will call this function every time something is written in the input
     */
    onSuggestionsFetchRequested = ({ value }) => {
        let suggestions = []
        if (value.length > 0) {
            suggestions = this.props.friends.filter(f =>
                f.name.toLowerCase().slice(0, value.length) === value.trim().toLowerCase()
            );
        }
        this.setState({suggestions});
    };
    

    /**
     * Render
     */
    render() {       
        return (
            <Modal visible={this.props.visible} width="400" effect="fadeInDown" 
                   onClickAway={this.props.close}
            >
                <div className='popup-wrapper'>
                    <div className='popup-header'>
                        <h3 className='popup-title'>{this.props.title}</h3>
                        <input className='popup-input popup-input--block' placeholder='List Name'
                            onChange={ev=>this.setState({taskListName: ev.currentTarget.value})}
                            onKeyPress={(ev) => { if(ev.key==='Enter') { this.acceptEventHandler() }}}
                            value={this.props.taskListName} disabled={this.props.type!=='CREATE'}/>
                    </div>
                    <div className='popup-body'>
                        <div className='tab-panel'>
                            <div className='tab-options'>
                                <span>Search friends</span>
                            </div>
                            <div className='autosuggest-wrapper'>
                                <Autosuggest
                                        suggestions={this.state.suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={suggestion => suggestion.email}
                                        renderSuggestion={suggestion => 
                                            <MemberResult name={suggestion.name} avatar={suggestion.avatar} email={suggestion.email} alreadyMember/>
                                        }
                                        inputProps={{
                                            placeholder: `Enter the user's name`,
                                            value: this.state.value,
                                            onChange: this.onChange
                                        }}
                                />
                                <button className='member-button' onClick={this.addMemberEventHandler}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        <div className='tab-panel'>
                            <div className='tab-options'>
                                <span>List members</span>
                            </div>
                            <ol className='tab-members'>
                            {   this.props.members && this.props.members.map((member, index) => {
                                    return  <li key={index}>
                                                <MemberResult index={index} name={member.name} avatar={member.avatar} email={member.email} 
                                                                owner={member.email===this.props.owner.email} alreadyMember={true}/>
                                            </li>
                                })
                            }
                            </ol>
                        </div>
                        { this.props.type === 'UPDATE' && this.state.newMembers.length > 0 &&
                            <div className='tab-panel p-0'>
                                <div className='tab-options'>
                                    <span>New members</span>
                                </div>
                                <ol className='tab-members'>
                                {   this.state.newMembers.map((newMember, index) => {
                                    return  <li key={index}>
                                                <MemberResult index={index} name={newMember.name} avatar={newMember.avatar} 
                                                              email={newMember.email} owner={false} alreadyMember={false}/>
                                            </li>})
                                }
                                </ol>
                            </div>
                        }
                    </div>
                    <div className='popup-footer'>
                        <ButtonBase onClick={this.props.onClose} text='Cancel' className='mr-2' />
                        <ButtonBase onClick={this.acceptEventHandler} text='Save' color='lightblue'/>
                    </div>
                </div>
            </Modal>
        );
    }
       
    /**
     * Añadir un miembro a la lista
     * @param {Event} ev Evento generado
     */
    addMemberEventHandler = (ev) => {
        if (this.state.value !== '') {
            const friend =  this.props.friends.find(m => m.email === this.state.value);
            const alreadyMember = this.props.members && this.props.members.find(m => m.email === this.state.value);
            if(friend && !alreadyMember) {
                const newMembers = this.state.newMembers;
                newMembers.push({...friend, newMember: true});
                this.setState({newMembers, value: ''});
            }
        }
    }

    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    removeMemberEventHandler = (ev) => {
        if (ev.currentTarget.value!==this.state.owner.email) {
            const newMembers = this.state.newMembers;
            newMembers.splice(ev.currentTarget.dataset.index,1);
            this.setState({newMembers});
        } else {
            alert('No puede eliminar el propietario de la lista');
        }
    }

    /**
     * Evento disparado al pulsar en el botón de aceptar del modal
     * @param {*} ev 
     */
    acceptEventHandler = () => {
        switch (this.props.type) {
            case 'CREATE': {
                if (this.props.taskListName !== '') {
                    this.props.onAccept(this.props.taskListName, this.state.newMembers);
                    this.setState({newMembers: []});
                }
                break;
            }               
            case 'UPDATE': {
                this.props.onAccept(this.props.taskListName, this.state.newMembers);
                this.setState({newMembers: []});
                break;
            }
            default: 
                alert('Error incontrolado');
                break;
        }
    }
}