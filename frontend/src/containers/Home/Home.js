/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */

/* Import css */
import './Home.css';


class HomeAux extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mail: ''
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
            <div>
                <h1>Lista de la compra</h1>
                <p>Lista de la compra</p>
                <p>Nombre: {this.state.name}</p>
                <p>Mail: {this.state.mail}</p>
            </div>
        );
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
    };
};
const Home = connect(mapState, null)(HomeAux);
export default Home;