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


class HomeAux extends React.Component {
    
    componentDidMount() {
        try {
            console.log(this.props.user);
            if (!this.props.user.id) {
                this.props.history.push("/login");
            }
            // Temporal, hasta que funcione el storage
            Axios.get('/tasklists', { headers: { 'Authorization': "bearer " + this.props.user.token }})
            .then (response => {
                if (response.status === 200) {
                    this.props.init(response.data.results);
                }
            })
            .catch(error => {
                console.log(error);
            });
        } catch (error) {
        }
    }

    render() {
        return (
            <div className="wrapper"> 
                <Sidebar/>
                <MainContainer/>
            </div>
        );
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
    init: actions.init,
    loadList: actions.loadList
}

const Home = connect(mapState, mapActions)(HomeAux);
export default Home;