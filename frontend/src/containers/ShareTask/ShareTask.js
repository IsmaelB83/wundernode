/* Import node modules */
import React from 'react';
import Modal from 'react-awesome-modal';
import Autosuggest from 'react-autosuggest';
/* Import own modules */
import ButtonBase from '../../components/Buttons/ButtonBase/ButtonBase';
/* Import own css */
import './ShareTask.css';
     

/**
* Popup modal para compartir una lista de tareas con tus amigos
*/
export default class ShareTask extends React.Component {
    
    /**
    * Constructor
    * @param {*} props 
    */
    constructor(props) {
        // Superclass
        super(props);
        // Event handlers
        this.removeMember = this.removeMemberEventHandler.bind(this);
        this.addMember = this.addMemberEventHandler.bind(this);
        // Estado
        this.state = {
            members: [],
            value: '',
            suggestions: []
        }
    }
    
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    
    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: value => {
                const inputValue = value.trim().toLowerCase();
                const inputLength = inputValue.length;
                return inputLength === 0 ? [] : this.props.friends.filter(lang =>
                    lang.name.toLowerCase().slice(0, inputLength) === inputValue);
                }
        });
    };
    
    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        // Capture state variables
        const { value, suggestions } = this.state;
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: `Enter the user's name`,
            value,
            onChange: this.onChange
        };
        
        return (
            <Modal visible={this.props.visible} width="400" effect="fadeInDown" onClickAway={this.props.close}>
                <div className='popup-wrapper'>
                    <div className='popup-header'>
                        <h3 className='popup-title'>Comparte la lista</h3>
                    </div>
                    <div className='popup-body'>
                        <div className='tab-panel'>
                            <div className='tab-options'>
                                <span>List members</span>
                            </div>
                            <div className='autosuggest-wrapper'>
                                <Autosuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={suggestion => suggestion.email}
                                        renderSuggestion={suggestion => 
                                            <div className='popup-owner popup-owner--result'>   
                                                <img src={suggestion.avatar} alt="avatar"></img>
                                                <div className='popup-ownerdata'>
                                                    <p className='user'>{suggestion.name}</p>
                                                    <p className='email'>{suggestion.email}</p>
                                                </div>
                                            </div>
                                        }
                                        inputProps={inputProps}
                                />
                                <button className='member-button' onClick={this.addMember}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </div>
                            <ol className='tab-members'>
                                {   this.props.selected.members && 
                                    this.props.selected.members.map((member, index) => {
                                        return  <li className='member' key={index}>
                                                    <div className='popup-owner'>   
                                                        <img src={member.avatar} alt="avatar"></img>
                                                        <div className='popup-ownerdata'>
                                                            <p className='user'>{member.name}
                                                                <span className={`member member--${member.email===this.props.selected.owner.email?'red':'blue'}`}>
                                                                    {member.email===this.props.selected.owner.email?'owner':'member'}
                                                                </span>
                                                            </p>
                                                            <p className='email'>{member.email}</p>
                                                        </div>
                                                    </div> 
                                                </li>
                                    })
                                }
                                {
                                    this.state.members.map((member, index) => {
                                        return  <li className='member' key={index}>
                                                    <div className='popup-owner'>   
                                                        <img src={member.avatar} alt="avatar"></img>
                                                        <div className='popup-ownerdata'>
                                                            <p className='user'>{member.name}<span className='member member--red'>not sent</span></p>
                                                            <p className='email'>{member.email}</p>
                                                        </div>
                                                    </div> 
                                                    <button className='member-button' data-index={index} onClick={this.removeMember}>
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                    })
                                }
                            </ol>
                        </div>
                    </div>
                    <div className='popup-footer'>
                        <ButtonBase className='mr-2' onClick={this.props.close} text='Cancel'/>
                        <ButtonBase onClick={this.props.addMembers} text='Add' color='lightblue'/>
                    </div>
                </div>
            </Modal>
            );
        };
       
    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    addMemberEventHandler() {
        const member =  this.props.friends.find(m => m.email === this.state.value);
        const aux1 = this.state.members.find(m => m.email === this.state.value);
        const aux2 = this.props.selected.members.find(m => m.email === this.state.value);
        if(member && !aux1 && !aux2) {
            const members = this.state.members;
            members.push(member);
            this.setState({members});
        }
    }

    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    removeMemberEventHandler(ev) {
        const members = this.state.members;
        members.splice(ev.currentTarget.dataset.index,1);
        this.setState({members});
    }

    refreshTaskList(id, members, owner){
        this.setState({
            id: id,
            members: [],
            currentMembers: members,
            owner: owner
        })
    }
}