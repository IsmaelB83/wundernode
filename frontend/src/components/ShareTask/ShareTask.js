/* Import node modules */
import React from 'react';
import Axios from 'axios';
import Modal from 'react-awesome-modal';
import Autosuggest from 'react-autosuggest';
/* Import own modules */
import ButtonBase from '../Buttons/ButtonBase';
/* Import own css */
import './ShareTask.css';

// Imagine you have a list of languages that you'd like to autosuggest.
let members = [];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    
    return inputLength === 0 ? [] : members.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};
    
// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.email;
    
// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div className='popup-owner popup-owner--result'>   
        <img src={suggestion.avatar} alt="avatar"></img>
        <div className='popup-ownerdata'>
            <p className='user'>{suggestion.name}</p>
            <p className='email'>{suggestion.email}</p>
        </div>
    </div>   
);
        
/**
* 
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
        this.addMemberToList = this.addMemberToListEventHandler.bind(this);
        // Estado
        this.state = {
            id: this.props.id,
            show: this.props.show,
            newMembers: [],
            currentMembers: this.props.members,
            owner: this.props.owner,
            // Autosuggestion input field
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
            suggestions: getSuggestions(value)
        });
    };
    
    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    
    componentDidMount() {
        if (this.props.token) {
            members = [];
            Axios.get('/users/friends', { headers: { 'Authorization': "bearer " + this.props.token }})
            .then (result => {
                result.data.results.forEach(u => {
                    members.push(u);
                });
            })
            .catch(error => {
                alert('No se han encontrado amigos');
            });
        }
    }

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
            <Modal visible={this.state.show} width="400" effect="fadeInDown" 
                   onClickAway={ev => this.setState({show: false})}>
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
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        inputProps={inputProps}
                                />
                                <button className='member-button' onClick={this.addMember}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </button>
                            </div>
                            <ol className='tab-members'>
                                {   this.state.currentMembers && 
                                    this.state.currentMembers.map((member, index) => {
                                        return  <li className='member' key={index}>
                                                    <div className='popup-owner'>   
                                                        <img src={member.avatar} alt="avatar"></img>
                                                        <div className='popup-ownerdata'>
                                                            <p className='user'>{member.name}
                                                                <span className={`member member--${member.email===this.state.owner.email?'red':'blue'}`}>
                                                                    {member.email===this.state.owner.email?'owner':'member'}
                                                                </span>
                                                            </p>
                                                            <p className='email'>{member.email}</p>
                                                        </div>
                                                    </div> 
                                                    <button className='member-button' data-index={index} onClick={this.removeMember}>
                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </li>
                                    })
                                }
                                {
                                    this.state.newMembers.map((member, index) => {
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
                        <ButtonBase className='mr-2' onClick={ev => this.setState({show: false})} text='Cancel'/>
                        <ButtonBase onClick={this.addMemberToList} text='Add' color='lightblue'/>
                    </div>
                </div>
            </Modal>
            );
        };
        
        async addMemberToListEventHandler() {
            try {
                if (this.state.newMembers.length > 0) {
                    // Lista de miembros a añadir
                    const members = [];
                    this.state.newMembers.forEach(m => members.push(m.email));                  
                    const result = await Axios.put(`/tasklists/${this.state.id}`, null, { 
                        headers: { 'Authorization': "bearer " + this.props.token },
                        data: { members }
                    });
                    if (result.status === 200) {
                        this.setState({show: false});
                    }
                }
            }
            catch (error) {
                console.log(error)
            }
        }
       
    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    addMemberEventHandler() {
        const member =  members.find(m => m.email === this.state.value);
        const aux1 = this.state.newMembers.find(m => m.email === this.state.value);
        const aux2 = this.state.currentMembers.find(m => m.email === this.state.value);
        if(member && !aux1 && !aux2) {
            const newMembers = this.state.newMembers;
            newMembers.push(member);
            this.setState({newMembers});
        }
    }

    /**
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    removeMemberEventHandler(ev) {
        const newMembers = this.state.newMembers;
        newMembers.splice(ev.currentTarget.dataset.index,1);
        this.setState({newMembers});
    }

    show(){
        this.setState({show: true});
    }
    
    refreshTaskList(id, members, owner){
        this.setState({
            id: id,
            newMembers: [],
            currentMembers: members,
            owner: owner
        })
    }
}