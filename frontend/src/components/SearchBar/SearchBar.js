/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight/ButtonLight';
/* Import own CSS */
import './SearchBar.css';


/**
 * Componente para barra de busquedas
 */
export default class SearchBar extends Component {
  
    /**
     * Initial state
     */
    state = {value: ''}

    /**
     * Render
     */
    render() {
        return (
            <div className='SearchBar'>
                <ButtonLight icon='fas fa-bars' color='white' onClick={this.props.collapseEventHandler}/>
                <input className='SearchBar-input' value={this.state.value}
                       onChange={ev=>this.setState({value: ev.currentTarget.value})}/>
                <ButtonLight icon='fas fa-search' color='white' onClick={this.searchEventHandler}/>
            </div>
        );
    };

    /**
     * Click en el botón de búsqueda
     */
    searchEventHandler = () => {
        if (this.state.value !== '') {
            this.props.searchEventHandler(this.state.value);
        }
    }
}