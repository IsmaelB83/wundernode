/* Import node modules */
import React from 'react';
/* Import own modules */
import UserDropDown from '../UserDropDown/UserDropDown';
import ButtonLight from '../Buttons/ButtonLight';
import './UserBar.css';

export default class UserBar extends React.Component {
  
    render() {
        return (
            <div className="userbar">
                <UserDropDown/>
                <div className="userbar-actions">
                    <ButtonLight icon="far fa-bell" color="grey"/>
                    <ButtonLight icon="far fa-comments" color="grey"/>
                </div>
            </div>
        );
    };
}