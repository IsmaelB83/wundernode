/* Import node modules */
import { connect } from 'react-redux';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import ModalTaskList from '../ModalTaskList/ModalTaskList';
import SideBarContainer from '../SideBarContainer/SideBarContainer';
import TodoSectionContainer from '../TodoSectionContainer/TodoSectionContainer';
import { actions } from '../../store/Store';
/* Import css */
import './App.css';


/**
 * Pagina principal de wundernode
 */
class AppAux extends React.Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state = {
            modalTask: false,
            modalType: null,
            showCompleted: false,
        }
    }

    /**
     * Cuando el componente se monta
     */
    componentDidMount() {
        try {
            // Resize de la aplicación
            window.addEventListener("resize", this.resizeEventHandler);
            // Detectar el ESC para cerrar el import
            document.addEventListener("keydown", this.keyDownEventHandler);
            // Si no hay usuario logueado redirigo al login
            if (!this.props.user.id) {
                return this.props.history.push('/login');
            }
            // Cargar listado de tareas
            Axios.get('/tasklists', { headers: { 'Authorization': 'bearer ' + this.props.user.token }})
            .then (response => {
                if (response.status === 200) {
                    this.props.loadLists(response.data.results);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <div className='App'> 
                <SideBarContainer       user={this.props.user} 
                                        createTaskListEventHandler={this.createTaskListEventHandler} 
                />
                <TodoSectionContainer   user={this.props.user}
                                        shareTaskListEventHandler={this.shareTaskListEventHandler}
                />
                { this.props.user.email &&
                    <ModalTaskList  ref={this.modal}
                                    visible={this.state.modalTask}
                                    type={this.state.modalType}
                                    title={this.state.modalType==='UPDATE'?'Share TaskList with your friends':'Create a new TaskList'}
                                    taskListName={this.state.modalType==='UPDATE'?this.props.selected.description:''}
                                    friends={this.props.user.friends} 
                                    members={this.state.modalType==='UPDATE'?this.props.selected.members:[{
                                            id: this.props.user.id, 
                                            name: this.props.user.name,
                                            email: this.props.user.email, 
                                            avatar: this.props.user.avatar}]
                                    }
                                    owner={this.state.modalType==='UPDATE'?this.props.selected.owner:this.props.user}
                                    onClose={() => this.setState({modalTask: false, modalType: null})} 
                                    onAccept={this.modalTaskListAccept}/>
                }
            </div>
        );
    }

    /**
     * Resize de la app
     */
    resizeEventHandler = () => {
        if (window.innerWidth < 750 && !this.props.collapsed) {
            this.props.collapseSideBar();
        } else if (window.innerWidth >= 750 && this.props.collapsed) {
            this.props.collapseSideBar();
        }
    }

    /**
     * Close modal
     */
    keyDownEventHandler = (ev) => {
        if (ev.keyCode === 27 && this.state.modalTask) {
            this.setState({modalTask: !this.state.modalTask});
        }
    }

    /**
     * Click en compartir task list
     */
    shareTaskListEventHandler = () => {
        // Sólo se permite modificar una tarea de la que seas propietario
        if(this.props.selected.owner && this.props.selected.owner.email === this.props.user.email) {
            this.setState({modalTask: true, modalType: 'UPDATE'});
        } else {
            alert('Sólo el propietario de la lista puede invitar a otras personas');
        } 
    }

    /**
     * Click en crear una tasklist
     */
    createTaskListEventHandler = () => {
        this.setState({modalTask: true, modalType: 'CREATE'})
    }

    /**
     * 
     * Gestiona el evento de aceptación del modal de tasklist (creación o edición de lista)
     * @param {String} members Nombre descriptivo de la lista
     * @param {Array} members Miembros a añadir a la lista
     */
    modalTaskListAccept = async (description, members) => {
        try {
            // Creo un array de miembros unicamente con el _id
            const membersFiltered = [];
            members.filter(m=>m.newMember).map(m=>membersFiltered.push(m.id));
            // Dependiendo de la operación
            switch (this.state.modalType) {
                // Creo una nueva lista 
                case 'CREATE': {
                    const result = await Axios.post('/tasklists', null, { 
                        headers: { 'Authorization': 'bearer ' + this.props.user.token },
                        data: { description: description, members: membersFiltered }
                    });
                    if (result.status === 200) {
                        this.props.addTaskList(result.data.result);
                        this.setState({modalTask: false});
                    }
                    break;
                }      
                // Actualizo la lista       
                case 'UPDATE': {
                    const result = await Axios.put(`/tasklists/${this.props.selected.id}`, null, { 
                        headers: { 'Authorization': 'bearer ' + this.props.user.token },
                        data: { members: membersFiltered }
                    });
                    if (result.status === 200) {
                        this.props.addMembers(members);
                        this.setState({modalTask: false});
                    }
                    break; 
                }
                // Error incontrolado
                default: { 
                    alert('Error incontrolado'); 
                    break;           
                }
            }
            
        }
        catch (error) {
            console.log(error)
        }
    }
  
    /**
     * Sort To-Dos
     * (NOT IMPLEMENTED YET. Issue #5 )
     */
    sortTodosEventHandler = () => alert('Sort todos not implemented yet');
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user, 
        lists: state.lists,
        selected: state.selected,
        switch: state.switch,
        collapsed: state.collapsed,
    };
};

const mapActions = {
    loadLists: actions.loadLists,
    addTaskList: actions.addTaskList,
    addMembers: actions.addMembers,
    collapseSideBar: actions.collapseSideBar,
}

const App = connect(mapState, mapActions)(AppAux);
export default App;