/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Modal from 'react-awesome-modal';
import Autosuggest from 'react-autosuggest';
/* Import own modules */
import ButtonBase from '../Buttons/ButtonBase';
import { actions } from '../../store/Store';
/* Import own css */
import './CreateTask.css';

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
class CreateTaskAux extends React.Component {
    
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
        this.createList = this.createListEventHandler.bind(this);
        // Estado
        this.state = {
            popup : false,
            taskListName: '',
            members: [],
            // Autosuggestion input field
            value: '',
            suggestions: []
        }
    }
    
    componentDidMount() {
        if (this.props.user.token) {
            members = [];
            Axios.get('/users/friends', { headers: { 'Authorization': "bearer " + this.props.user.token }})
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
                                        <li className='popup-owner'>   
                                            <img src={this.props.user.avatar} alt="avatar"></img>
                                            <div className='popup-ownerdata'>
                                                <p className='user'>{this.props.user.name}<span className='owner'>owner</span></p>
                                                <p className='email'>{this.props.user.email}</p>
                                            </div>
                                        </li>    
                                        {
                                            this.state.members.map((member, index) => {
                                                return  <li className='member'>
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
                    const members = [];
                    this.state.members.forEach(m => members.push(m._id));
                    const result = await Axios.post('/tasklists', null, { headers: { 'Authorization': "bearer " + this.props.user.token },
                        data: { description: this.state.taskListName, members }
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
    * Añadir un miembro a la lista
    * @param {Event} ev Evento generado
    */
    addMemberEventHandler() {
        const member =  members.find(m => m.email === this.state.value);
        if(member) {
            const stateMembers = this.state.members;
            stateMembers.push(member);
            this.setState({members: stateMembers});
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