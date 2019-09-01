/* Import node modules */
import { connect } from 'react-redux';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import ButtonHeading from '../../components/Buttons/ButtonHeading/ButtonHeading';
import TodoList from '../../components/TodoList/TodoList';
import TodoBar from '../../components/TodoBar/TodoBar';
import ToolBar from '../../components/ToolBar/ToolBar';
import { Config } from '../../config';
import { actions } from '../../store/Store';
/* Impoer css */
import './TodoSectionContainer.css'


/**
 * Container principal de la aplicación
 */
class TodoSectionContainerAux extends React.Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.audio = new Audio(`${process.env.PUBLIC_URL}${Config.sounds.completed}`);
        this.state = {
            showCompleted: false,
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <main className={`TodoSectionContainer ${!this.props.collapsed?'TodoSectionContainer--collapsed':''}`}>
                <ToolBar id='toolBar' 
                         collapseSideBar={this.props.collapsed}
                         description={this.props.selected.description} 
                         shareTaskListEventHandler={this.props.shareTaskListEventHandler}
                         sortTodosEventHandler={this.sortTodosEventHandler}
                         collapseSideBarEventHandler={this.collapseSideBarEventHandler}
                />
                <section className='TodoSectionContainer-wrapper'>
                    <TodoBar id='todoBar' todoAddEventHandler={this.todoAddEventHandler}/>
                    <div className='MainContainer-todos'>
                        <TodoList id='todosPending' 
                                  completed={false}
                                  todos={this.props.selected.tasks}
                                  todoStarredEventHanlder={this.todoStarredEventHanlder} 
                                  todoCompleteEventHandler={this.todoCompleteEventHandler} 
                        />
                        <ButtonHeading text='Show completed to-dos' 
                                       onClick={ev=>this.setState({showCompleted: !this.state.showCompleted})}
                        />
                        <TodoList id='todosDone' 
                                  completed={true}
                                  showCompleted={this.state.showCompleted}
                                  todos={this.props.selected.tasks}
                                  todoCompleteEventHandler={this.todoCompleteEventHandler} 
                        />
                    </div>
                </section>
            </main>
        );
    }

    /**
     * Añadir un todo a la lista actual
     * @param {String} description Nombre del todo a crear 
     */
    todoAddEventHandler = async (description, starred, due) => {
        try {
            const result = await Axios.post(`/tasklists/tasks`, null, {
                headers: { 'Authorization': 'bearer ' + this.props.user.token },
                data: {
                    id: this.props.selected.id,
                    description,
                    starred,
                    due
                }
            });
            if (result.status === 200) {
                this.props.addTodo(result.data.result);
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Marcar como importante un todo
     * @param {String} id ObjectId del Todo
     * @param {Boolean} starred Todo important (true/false)
     */
    todoStarredEventHanlder = async (id, starred) => {
        try {
            // Call API to starred task
            let result = await Axios.put(`/tasklists/tasks/${id}/star`, null, {
                headers: { 'Authorization': "bearer " + this.props.user.token },
                data: { starred }
            });
            if (result.status === 200) {
                this.props.starTodo(id, starred);
            }
        } catch (error) {
            console.log(error)
        }   
    }

    /**
     * Marcar como completado un todo
     * @param {String} id ObjectId del Todo
     * @param {Boolean} completed Todo completado (true/false)
     * @param {Boolean} starred Todo important (true/false)
     */
    todoCompleteEventHandler = async (id, completed, starred) => {
        try {
            // Call API to starred task
            let result = await Axios.put(`/tasklists/tasks/${id}/complete`, null, {
                headers: { 'Authorization': "bearer " + this.props.user.token },
                data: { completed }
            });
            if (result.status === 200) {
                this.audio.currentTime = 0; 
                this.audio.play();     
                this.props.completeTodo(id, completed, starred);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Minimiza/Muestra el sidebar
     */
    collapseSideBarEventHandler = () => { 
        this.props.collapseSideBar();
    }
    
    /**
     * Sort To-Dos
     * (NOT IMPLEMENTED YET. Issue #13 )
     */
    sortTodosEventHandler = () => alert('Sort todos not implemented yet');
}

// React-Redux
const mapState = (state) => { 
    return {
        selected: state.selected,
        switch: state.switch,
        collapsed: state.collapsed,
    };
};

const mapActions = {
    addTodo: actions.addTodo,
    starTodo: actions.starTodo,
    completeTodo: actions.completeTodo,
    collapseSideBar: actions.collapseSideBar,
}

const TodoSectionContainer = connect(mapState, mapActions)(TodoSectionContainerAux);
export default TodoSectionContainer;