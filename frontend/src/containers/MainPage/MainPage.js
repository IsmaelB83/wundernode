/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import Sidebar from '../Sidebar/Sidebar';
import TaskPanel from '../TaskPanel/TaskPanel';
/* Import css */
import './MainPage.css';


class MainPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    componentDidMount() {
        fetch('/list')
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
        });
    }

    render() {
        return (
            <div className="wrapper"> 
                <Sidebar/>
                <TaskPanel/>                
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
    };
};
const Home = connect(mapState, null)(MainPage);
export default Home;