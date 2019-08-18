/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import UserDropDown from '../UserDropDown/UserDropDown';
import ButtonLight from '../Buttons/ButtonLight';
import './UserBar.css';

class UserBarAux extends React.Component {
  
    render() {
        return (
            <div className='userbar'>
                <UserDropDown user={this.props.user}/>
                <div className='userbar-actions'>
                    <ButtonLight className='mr-2' icon='far fa-bell' color='grey'/>
                    <ButtonLight icon='fas fa-sync-alt' color='grey'/>
                </div>
            </div>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return { 
        user: state.user,
    };
};

const UserBar = connect(mapState, null)(UserBarAux);
export default UserBar;