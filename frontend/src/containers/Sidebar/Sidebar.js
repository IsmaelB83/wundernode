/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import TaskList from '../../components/TaskList/TaskList';
import UserBar from '../../components/UserBar/UserBar';
import SearchBar from '../../components/SearchBar/SearchBar';
/* Import css */
import './Sidebar.css';


class SidebarAux extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    componentDidMount() {
        /* fetch('/list')
        .then(response => {
            response.json()
            .then(result => {
                this.setState({
                    name: result.name,
                    mail: result.mail
                })
            })
        })
        .catch(error => {
            console.log(error);
        }); */
    }

    render() {
        return (
            <div className="sidebar" role="navigation">
                <SearchBar/>
                <UserBar/>
                <TaskList/>
                <div className="createbutton">
                    <button><i className="fa fa-plus"></i>Create List</button>
                </div>
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
    };
};
const Sidebar = connect(mapState, null)(SidebarAux);
export default Sidebar;