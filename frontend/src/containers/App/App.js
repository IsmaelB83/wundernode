/* Import node modules */
import { connect } from 'react-redux';
import React from 'react';
import Axios from 'axios';
/* Import own modules */
import ButtonHeading from '../../components/Buttons/ButtonHeading/ButtonHeading';
import TodoBar from '../../components/TodoBar/TodoBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import ToolBar from '../../components/ToolBar/ToolBar';
import TodoPanel from '../../containers/TodoPanel/TodoPanel';
import ModalTaskList from '../../containers/ModalTaskList/ModalTaskList';
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
        this.modal = React.createRef();
        this.state = {
            modalTask: false,
            modalType: null,
            showCompleted: false
        }
    }

    /**
     * Cuando el componente se monta
     */
    componentDidMount() {
        try {
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
                <Sidebar className='App-sidebar' onCreate={this.createTaskListClick}/>
                <div className='App-main'>
                    <ToolBar id='toolBar' description={this.props.selected.description} 
                        onShare={this.shareTaskListClick}
                        onSort={() => alert('Not implemented yet')}
                        onMore={() => alert('Not implemented yet')}
                        />
                    <div className='App-main_wrapper'>
                        <TodoBar id='todoBar' addTodo={this.addTodo}/>
                        <div className='MainContainer-todos'>
                            <TodoPanel id='todosPending' completed={false}/>
                            <ButtonHeading text='Show completed to-dos' onClick={ev=>this.setState({showCompleted: !this.state.showCompleted})}/>
                            <TodoPanel id='todosDone' completed={true} showCompleted={this.state.showCompleted}/>
                        </div>
                    </div>
                </div>
                <ModalTaskList ref={this.modal}
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
            </div>
        );
    }

    /**
     * Click en compartir task list
     */
    shareTaskListClick = () => {
        // Sólo se permite modificar una tarea de la que seas propietario
        if(this.props.selected.owner && this.props.selected.owner.email === this.props.user.email) {
            this.modal.current.refreshData(
                'UPDATE', 
                'Share TaskList with your friends', 
                this.props.selected.description,
                this.props.selected.owner, 
                this.props.selected.members, 
                this.props.user.friends
            );
            this.setState({modalTask: true, modalType: 'UPDATE'});
        } else {
            alert('Sólo el propietario de la lista puede invitar a otras personas');
        } 
    }

    /**
     * Click en crear una tasklist
     */
    createTaskListClick = () => {
        this.modal.current.refreshData(
            'CREATE', 
            'Create a new TaskList',
            '',
            this.props.user, 
            [{  id: this.props.user.id, 
                name: this.props.user.name,
                email: this.props.user.email, 
                avatar: this.props.user.avatar}
            ], 
            this.props.user.friends
        );
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
            switch (this.state.modalType) {
                // Creo una nueva lista 
                case 'CREATE': {
                    const result = await Axios.post('/tasklists', null, { headers: { 'Authorization': "bearer " + this.props.user.token },
                        data: { description: description, members }
                    });
                    if (result.status === 200) {
                        this.props.addTaskList(result.data.result);
                        this.setState({modalTask: false});
                    }
                    break;      
                }      
                // Actualizo la lista       
                case 'UPDATE': {
                    const result = await Axios.put(`/tasklists/${this.state.id}`, null, { 
                        headers: { 'Authorization': "bearer " + this.props.token },
                        data: { members }
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
     * Añadir un todo a la lista actual
     * @param {String} description Nombre del todo a crear 
     */
    addTodo = async (description) => {
        if (this.state.input === '') {
            this.setState({focus: true});
        } else {
            try {
                let result = await Axios.post(`/tasklists/tasks`, null, {
                    headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: {
                        id: this.props.selected.id,
                        description,
                        starred: this.state.starred,
                    }
                });
                if (result.status === 200) {
                    this.props.addTodo(result.data.result);
                }
                this.setState({
                    input: '',
                    starred: false
                });
            } catch (error) {
                console.log(error)
            }
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user, 
        lists: state.lists,
        selected: state.selected,
        switch: state.switch
    };
};

const mapActions = {
    loadLists: actions.loadLists,
    addTaskList: actions.addTaskList,
    addTodo: actions.addTodo,
    addMembers: actions.addMembers,
}

const App = connect(mapState, mapActions)(AppAux);
export default App;