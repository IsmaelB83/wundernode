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
import ShareTask from '../../containers/ShareTask/ShareTask'
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
        // Event Handlers
        this.addTodo = this.addTodoEventHandler.bind(this);
        // Estado inicial
        this.state = {
            modalShare: false,
            modalCreate: false,
            showCompleted: false
        }
    }

    /**
     * Render
     */
    render() {
        return (
            <div className='App'> 
                <Sidebar className='App-sidebar'/>
                <div className='App-main'>
                    <ToolBar id='toolBar' description={this.props.selected.description} 
                        onShare={() => this.setState({modal: true})}
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
                <ShareTask visible={this.state.modalShare} selected={this.props.selected} friends={this.props.user.friends} 
                           close={() => this.setState({modalShare: false})}/>
            </div>
        );
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
     * Compartir la lista con los nuevos miembros indicados
     * @param {*} newMembers 
     */
    async shareTask(newMembers) {
        try {
            if (newMembers.length > 0) {
                const members = [];
                newMembers.forEach(m => members.push(m.email));           
                // Actualizo la lista       
                const result = await Axios.put(`/tasklists/${this.state.id}`, null, { 
                    headers: { 'Authorization': "bearer " + this.props.token },
                    data: { members }
                });
                if (result.status === 200) {
                    this.props.addMembers(newMembers);
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Crear una tasklist con los miembros indicados
     * @param {String} description Nombre de la tasklist
     * @param {Array} members Arrany de miembros de la tasklist
     */
    async createTaskList(description, members) {
        try {
            if (description) {
                const result = await Axios.post('/tasklists', null, { headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: { description: description, members }
                });
                if (result.status === 200) {
                    this.props.addTaskList(result.data.result);
                    this.setState({modalCreate: false});
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Añadir un todo a la lista actual
     * @param {String} description Nombre del todo a crear 
     */
    async addTodoEventHandler(description) {
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
    addTodo: actions.addTodo,
    addMembers: actions.addMembers,
}

const App = connect(mapState, mapActions)(AppAux);
export default App;