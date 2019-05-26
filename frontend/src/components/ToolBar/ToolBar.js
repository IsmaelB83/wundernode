/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight'
/* Import css */
import './ToolBar.css';

export default class ToolBar extends React.Component {
  
    render() {
        return (
            <div className="list-toolbar">
                <h1 className="list-title">Lista compra carrefour</h1>
                <div className="list-actions">
                    <ButtonLight className='boton-md' color='white' icon='fas fa-user-plus' span='Share'/>
                    <ButtonLight className='boton-md' color='white' icon='fas fa-sort' span='Sort'/>
                    <ButtonLight className='boton-md' color='white' icon='fas fa-ellipsis-h' span='More'/>
                </div>
            </div>
        );
    };
}