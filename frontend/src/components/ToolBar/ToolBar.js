/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonLight from '../../components/Buttons/ButtonLight/ButtonLight'
/* Import css */
import './ToolBar.css';


/**
 * Componente barra superior de tareas de la aplicación
 */
export default class ToolBar extends React.Component {
  
    /**
     * Render
     */
    render() {
        return (
            <div className="list-toolbar">
                <h1 className="list-title">{this.props.description}</h1>
                <div className="list-actions">
                    <ButtonLight className='button-md' color='white' icon='fas fa-user-plus' span='Share' onClick={this.props.shareEventHandler}/>
                    <ButtonLight className='button-md' color='white' icon='fas fa-sort' span='Sort' onClick={this.props.sortEventHandler}/>
                    <ButtonLight className='button-md' color='white' icon='fas fa-ellipsis-h' span='More' onClick={this.props.moreEventHandler}/>
                </div>
            </div>
        );
    };
}