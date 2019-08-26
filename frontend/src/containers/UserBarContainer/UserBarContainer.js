/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
import UserBar from '../../components/UserBar/UserBar';


/**
 * Container component to handle UserBar
 */
class UserBarContainerAux extends React.Component {
          
    /**
     * Render
     */
    render() {
        return (
            <UserBar name={this.props.user.name} email={this.props.user.email} avatar={this.props.user.avatar}
                     syncNowEventHandler={this.syncNowEventHandler}
                     accountSettingsEventHandler={this.accountSettingsEventHandler}
                     signOutEventHandler={this.signOutEventHandler}
            />
        );
    };

    /**
     * Sincronizar con API rest
     */
    syncNowEventHandler = () => {
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

    /**
     * Account settings (NOT IMPLEMENTED YET)
     */
    accountSettingsEventHandler = () => alert("not implemented yet");

    /**
     * Logout y redirijo al login
     */
    signOutEventHandler = () => {
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

const UserBarContainer = connect(mapState, mapActions)(UserBarContainerAux);
export default UserBarContainer;