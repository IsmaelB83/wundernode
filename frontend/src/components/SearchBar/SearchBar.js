/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  
    render() {
        return (
            <div className="search">
                <ButtonLight icon="fas fa-bars" color="white"/>
                <input className="search-input"></input>
                <ButtonLight icon="fas fa-search" color="white"/>
            </div>
        );
    };
}