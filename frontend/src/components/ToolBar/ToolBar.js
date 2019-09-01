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
            <div className="ToolBar">
                { this.props.collapseSideBar && 
                    <ButtonLight icon='fas fa-bars' color='white' onClick={this.props.collapseSideBarEventHandler}/>
                }
                <h1 className="ToolBar-title">{this.props.description}</h1>
                <div className="ToolBar-actions">
                    <ButtonLight className='button-md' color='white' icon='fas fa-user-plus' span='SHARE' onClick={this.props.shareTaskListEventHandler}/>
                    <ButtonLight className='button-md' color='white' icon='fas fa-sort' span='SORT' onClick={this.props.sortTodosEventHandler}/>
                </div>
            </div>
        );
    };
}