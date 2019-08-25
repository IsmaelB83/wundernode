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
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <div className='SearchBar'>
                <ButtonLight icon='fas fa-bars' color='white' onClick={ev=>alert('Not implemented yet')}/>
                <input  className='SearchBar-input'
                        onFocus={()=>{this.setState({focus:true})}}
                        onBlur={()=>{this.setState({focus:false})}}
                />
                <ButtonLight icon={this.state.focus?'fas fa-times':'fas fa-search'} color='white' onClick={ev=>alert('Not implemented yet')}/>
            </div>
        );
    };
}