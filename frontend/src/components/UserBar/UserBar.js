/* Import node modules */
import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
/* Import own modules */
import ButtonLight from '../../components/Buttons/ButtonLight/ButtonLight';
/* Import css */
import './UserBar.css';


/**
 * Component to display the user
 */
export default class UserBar extends React.Component {
          
    /**
     * Initial state
     */
    state = { dropDownOpen: false };

    /**
     * Render
     */
    render() {
        return (
            <div className='UserBar'>
                <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggleEventHandler}>
                    <DropdownToggle className='UserBar-caret' caret>
                        <img src={this.props.avatar} alt="avatar"></img>
                        <span className='ml-2'>{this.props.name}</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem disabled>Last sync 8 minutes ago</DropdownItem>
                        <DropdownItem disabled>{this.props.email}</DropdownItem>
                        <DropdownItem onClick={this.props.syncNowEventHandler}><i className="fas fa-sync"></i>Sync now</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={this.props.createTaskListEventHandler}><i className="fa fa-tasks"></i>Create Task List</DropdownItem>
                        <DropdownItem onClick={this.props.manageFriendsEventHandler}><i className="fas fa-user-friends"></i>Manage friends</DropdownItem>
                        <DropdownItem onClick={this.props.accountSettingsEventHandler}><i className="fas fa-user-circle"></i>Account Settings</DropdownItem>
                        <DropdownItem onClick={this.props.signOutEventHandler}><i className="fas fa-sign-out-alt"></i>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <ButtonLight onClick={this.props.syncNowEventHandler} icon='fas fa-sync-alt' color='grey'/>
            </div>
        );
    };
    
    /**
     * Open/Collapse Dropdown Button
     */
    toggleEventHandler = () => this.setState({dropDownOpen: !this.state.dropDownOpen});
}