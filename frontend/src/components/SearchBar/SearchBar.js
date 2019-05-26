/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
    }

    render() {
        return (
            <div className='search'>
                <ButtonLight icon='fas fa-bars' color='white'/>
                <input  className='search-input'
                        onFocus={()=>{this.setState({focus:true})}}
                        onBlur={()=>{this.setState({focus:false})}}
                >
                </input>
                <ButtonLight icon={this.state.focus?'fas fa-times':'fas fa-search'} color='white'/>
            </div>
        );
    };
}