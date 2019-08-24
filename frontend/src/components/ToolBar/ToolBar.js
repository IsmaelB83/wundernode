/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import ButtonLight from '../Buttons/ButtonLight'
import ShareTask from '../ShareTask/ShareTask'
/* Import css */
import './ToolBar.css';


class ToolBarAux extends React.Component {
  
    constructor(props) {
        super(props);
        this.modal = React.createRef();
        this.state = {
        }
    }

    render() {
        return (
            <div className="list-toolbar">
                <h1 className="list-title">{ ( this.props.selected && this.props.selected.description ) || 'Inbox' }</h1>
                <div className="list-actions">
                    <ButtonLight className='button-md' color='white' icon='fas fa-user-plus' span='Share' onClick={ev=>{
                         this.modal.current.refreshTaskList(this.props.selected.id, this.props.selected.members, this.props.selected.owner);
                         this.modal.current.show();
                        }}/>
                    <ShareTask ref={this.modal} id={this.props.selected.id} token={this.props.user.token} members={this.props.selected.members} owner={this.props.selected.owner}/>
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
        user: state.user,
    };
};

const ToolBar = connect(mapState, null)(ToolBarAux);
export default ToolBar;