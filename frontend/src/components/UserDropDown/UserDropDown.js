/* Import node modules */
import React from 'react';
/* Import own modules */
import './UserDropDown.css';

export default class UserBar extends React.Component {
  
    render() {
        return (
            <div className="userbar">
                <button className="user">
                    <img src="http://www.jackedandstrong.com/wp-content/uploads/2016/08/Avatar-Facebook-1.jpg" alt="avatar"></img>
                    <span>ismael bernal</span>
                    <i className="fas fa-angle-down"></i>
                </button>
            </div>
        );
    };
}