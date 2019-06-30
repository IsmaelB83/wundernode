/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import Sidebar from '../Sidebar/Sidebar';
import MainContainer from '../MainContainer/MainContainer';
import { actions } from '../../store/Store';
/* Import css */
import './Home.css';


class HomeAux extends React.Component {
    
    componentDidMount() {
        fetch('/tasklist/all')
        .then (response => {
            if (response.status === 200) {
                response.json()
                .then(lists => {
                    fetch(`/tasklist/task/${lists.result[0]._id}`)
                    .then (response => {
                        if (response.status === 200) {
                            response.json()
                            .then (todos => {
                                this.props.init(lists.result);
                                this.props.loadList(0, lists.result[0], todos.result);  
                            })
                        }       
                    })
                });
            }
        });
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
        lists: state.lists,
    };
};
const mapActions = {
    init: actions.init,
    loadList: actions.loadList
}

const Home = connect(mapState, mapActions)(HomeAux);
export default Home;