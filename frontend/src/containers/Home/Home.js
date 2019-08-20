/* Import node modules */
import { connect } from 'react-redux';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import MainContainer from '../../components/MainContainer/MainContainer';
import Sidebar from '../../components/Sidebar/Sidebar'
import { actions } from '../../store/Store';
/* Import css */
import './Home.css';


/**
 * Pagina principal de wundernode
 */
class HomeAux extends React.Component {
    
    /**
     * Render
     */
    render() {
        return (
            <div className="wrapper"> 
                <Sidebar/>
                <MainContainer/>
            </div>
        );
    }

    /**
     * Cuando el componente se monta
     */
    componentDidMount() {
        try {
            // Si no hay usuario logueado redirigo al login
            if (!this.props.user.id) {
                this.props.history.push("/login");
            }
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
        lists: state.lists,
    };
};

const mapActions = {
    loadLists: actions.loadLists,
}

const Home = connect(mapState, mapActions)(HomeAux);
export default Home;