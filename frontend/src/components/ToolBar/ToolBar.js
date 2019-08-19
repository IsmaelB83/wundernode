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
                <h1 className="list-title">{ ( this.props.selected && this.props.selected.description ) || 'Inbox' }</h1>
                <div className="list-actions">
                    <ButtonLight className='button-md' color='white' icon='fas fa-user-plus' span='Share'/>
                    <ButtonLight className='button-md' color='white' icon='fas fa-sort' span='Sort'/>
                    <ButtonLight className='button-md' color='white' icon='fas fa-ellipsis-h' span='More'/>
                </div>
            </div>
        );
    };
}

// React-Redux
const mapState = (state) => { 
    return { 
        selected: state.selected,
        lists: state.lists,
    };
};

const ToolBar = connect(mapState, null)(ToolBarAux);
export default ToolBar;