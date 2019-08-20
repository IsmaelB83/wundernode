/* Import node modules */
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import React from 'react';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import css */
import './UserDropDown.css';

/**
 * Dropdown de la cuenta de usuario
 */
class UserBarAux extends React.Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);   
        // Manejadores    
        this.toggle = this.toggleEventHandler.bind(this);
        this.syncNow = this.syncNowEventHandler.bind(this);
        this.accountSettings = this.accountSettingsEventHandler.bind(this);
        this.signOut = this.signOutEventHandler.bind(this);
        // Estado
        this.state = {
            dropdownOpen: false
        };
    }
        
    render() {
        return (
            <div className="userbar">
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle className='user-caret' caret>
                        <img src={this.props.user.avatar} alt="avatar"></img>
                        <span>{this.props.user.name}</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem disabled>Last sync 8 minutes ago</DropdownItem>
                        <DropdownItem disabled>{this.props.user.email}</DropdownItem>
                        <DropdownItem onClick={this.syncNow}><i class="fas fa-sync"></i>Sync now</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={this.accountSettings}><i class="fas fa-user-circle"></i>Account Settings</DropdownItem>
                        <DropdownItem onClick={this.signOut}><i class="fas fa-sign-out-alt"></i>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    };

    toggleEventHandler() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    syncNowEventHandler() {
        try {
            // Cargar listado de tareas
            Axios.get('/tasklists', { headers: { 'Authorization': "bearer " + this.props.user.token }})
            .then (response => {
                if (response.status === 200) {
                    this.props.loadLists(response.data.results);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    accountSettingsEventHandler() {
        alert("not implemented yet");
    }

    /**
     * Logout y redirijo al login
     */
    signOutEventHandler() {
        this.props.logoff();
        this.props.history.push("/login");
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user, 
    };
};

const mapActions = {
    loadLists: actions.loadLists,
    logoff: actions.logoff,
}

const UserBar = connect(mapState, mapActions)(UserBarAux);
export default withRouter(UserBar);