/* Import node modules */
import React from 'react';
/* Import own modules */
import ButtonHeading from '../../components/Buttons/ButtonHeading';
import ToolBar from '../../components/ToolBar/ToolBar';
import TodoBar from '../../components/TodoBar/TodoBar';
import TodoPanel from '../../components/TodoPanel/TodoPanel';
/* Import css */
import './MainContainer.css';


export default class MainContainer extends React.Component {

    /**
     * State
     */
    state={showCompleted: false};

    /**
     * Render
     */
    render() {
        return (
            <div className='mainContainer'>
                <ToolBar id='toolBar'/>
                <div className='taskScWrapper'>
                    <TodoBar id='todoBar'/>
                    <div className='showCompleted'>
                        <TodoPanel id='todosPending' completed={false}/>
                        <ButtonHeading onClick={ev=>{this.setState({showCompleted: !this.state.showCompleted});}}/>
                        <TodoPanel id='todosDone' completed={true} showCompleted={this.state.showCompleted}/>
                    </div>
                </div>
            </div>
        );
    }
}