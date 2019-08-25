/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
import UserDropDown from '../UserDropDown/UserDropDown';
import ButtonLight from '../../components/Buttons/ButtonLight/ButtonLight';
/* Import css */
import './UserBar.css';


class UserBarAux extends React.Component {
          
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);   
        // Manejadores    
        this.syncNow = this.syncNowEventHandler.bind(this);
        // Estado
        this.state = {
        };
    }

    render() {
        return (
            <div className='userbar'>
                <UserDropDown user={this.props.user}/>
                <div className='userbar-actions'>
                    <ButtonLight onClick={this.syncNow} icon='fas fa-sync-alt' color='grey'/>
                </div>
            </div>
        );
    };

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
}


// React-Redux
const mapState = (state) => { 
    return {
        user: state.user, 
    };
};

const mapActions = {
    loadLists: actions.loadLists,
}

const UserBar = connect(mapState, mapActions)(UserBarAux);
export default UserBar;