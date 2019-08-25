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
        // Event handlers
        this.accept = this.acceptEventHandler.bind(this);
        this.removeMember = this.removeMemberEventHandler.bind(this);
        this.addMember = this.addMemberEventHandler.bind(this);
        // Estado
        this.state = {
            members: this.props.members,
            friends: this.props.friends,
            owner: this.props.owner,
            title: this.props.title,
            value: '',
            taskListName: this.props.taskListName,
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
            suggestions = this.state.friends.filter(f =>
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
            <Modal visible={this.props.visible} width="400" effect="fadeInDown" onClickAway={this.props.close}>
                <div className='popup-wrapper'>
                    <div className='popup-header'>
                        <h3 className='popup-title'>{this.state.title}</h3>
                        <input className='popup-input popup-input--block' placeholder='List Name'
                            onChange={ev=>this.setState({taskListName: ev.currentTarget.value})}
                            onKeyPress={(ev) => { if(ev.key==='Enter') { this.acceptEventHandler() }}}
                            value={this.state.taskListName} disabled={this.state.type!=='CREATE'}/>
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
                                <button className='member-button' onClick={this.addMember}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        <div className='tab-panel'>
                            <div className='tab-options'>
                                <span>List members</span>
                            </div>
                            {   // Miembros de la lista
                                <ol className='tab-members'>
                                    {   this.state.members && this.state.members.map((member, index) => {
                                        return  <li key={index}>
                                                    <MemberResult index={index} name={member.name} avatar={member.avatar} 
                                                                  email={member.email} owner={member.email===this.state.owner.email} 
                                                                  alreadyMember={!member.newMember}/>
                                                </li>})
                                    }
                                </ol>
                            }
                        </div>
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
    addMemberEventHandler(ev) {
        if (this.state.value !== '') {
            const friend =  this.state.friends.find(m => m.email === this.state.value);
            const alreadyMember = this.state.members && this.state.members.find(m => m.email === this.state.value);
            if(friend && !alreadyMember) {
                const members = this.state.members;
                members.push({...friend, newMember: true});
                this.setState({members, value: ''});
            }
        }
    }

    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    removeMemberEventHandler(ev) {
        if (ev.currentTarget.value!==this.state.owner.email) {
            const members = this.state.members;
            members.splice(ev.currentTarget.dataset.index,1);
            this.setState({members});
        } else {
            alert('No puede eliminar el propietario de la lista');
        }
    }

    /**
     * Evento disparado al pulsar en el botón de aceptar del modal
     * @param {*} ev 
     */
    acceptEventHandler = () => {
        switch (this.state.type) {
            case 'CREATE': {
                if (this.state.taskListName !=='' ) {
                    this.props.onAccept(this.state.taskListName, this.state.members);
                }
                break;
            }               
            case 'UPDATE': {
                this.props.onAccept(this.state.taskListName, this.state.members);
                break;
            }
            default: 
                alert('Error incontrolado');
                break;
        }
    }

    /**
     * Refresh Modal data 
     * @param {String} title 
     * @param {String} type Tipo de modal a mostrar(CREATE/UPDATE)
     * @param {Array} members Miembros de la lista
     * @param {Array} friends Amigos del usuarioa actual
     * @param {User} owner Propietario de la lista
     */
    refreshData(type, title, taskListName, owner, members, friends){
        this.setState({
            type: type,
            title: title,
            taskListName: taskListName,
            owner: owner,
            members: members,
            friends: friends
        })
    }
}