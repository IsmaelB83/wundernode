/* Import node modules */
import React from 'react';
/* Import own modules */
import './UserDropDown.css';

export default class UserBar extends React.Component {
    
    render() {
        return (
            <div className="userbar">
                <button className="user">
                    <img src={this.props.user.avatar} alt="avatar"></img>
                    <span>{this.props.user.name}</span>
                    <i className="fas fa-angle-down"></i>
                </button>
            </div>
        );
    };
}