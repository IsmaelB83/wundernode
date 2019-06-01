/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight'
/* Import css */
import './ToolBar.css';


class ToolBarAux extends React.Component {
  
    render() {
        return (
            <div className="list-toolbar">
                <h1 className="list-title">{this.props.taskList && this.props.taskList.description}</h1>
                <div className="list-actions">
                    <ButtonLight className='boton-md' color='white' icon='fas fa-user-plus' span='Share'/>
                    <ButtonLight className='boton-md' color='white' icon='fas fa-sort' span='Sort'/>
                    <ButtonLight className='boton-md' color='white' icon='fas fa-ellipsis-h' span='More'/>
                </div>
            </div>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return { 
        taskList: state.currentTaskList,
    };
};

const ToolBar = connect(mapState, null)(ToolBarAux);
export default ToolBar;