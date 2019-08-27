/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
/* Import own modules */
import { store, actions } from '../../store/Store';
import Input from '../../components/Inputs/Input';
/* Import css */
import './Styles.css';


/**
* Componente react para hacer login en la aplicación
*/
class LoginAux extends React.Component {
    
    /**
    * Constructor
    */
    constructor(props) { 
        super(props);
        this.state = {
            // Error control
            error: false,
            errorText: '',
            // Input Fields
            email: '', 
            password: '',
        };
    }

    /**
    * Login con token
    */
    componentDidMount() {
        try {
            const userString = localStorage.getItem('user')
            const user = JSON.parse(userString);
            if (user) {
                Axios.get('/users/login/token', {headers: {'Authorization': "bearer " + user.token}})
                .then(result => {
                    store.dispatch(actions.login(result.data.user));
                    this.props.history.push("/");
                })
                .catch(error => {
                    localStorage.clear();
                    this.setState({
                        error: true,
                        errorText: JSON.stringify(error)
                    });   
                });
            } else {
                localStorage.clear();
            }
        } catch (error) {
            localStorage.clear();
            this.setState({
                error: true,
                errorText: JSON.stringify(error)
            });   
        }
    }

    /**
    * Render 
    */
    render() {
        return (
            <div>
                <div className="alert alert-info small text-center" role="alert">
                    This site uses cookies for manage user session. By continuing to browse this site, you agree to this use.
                </div>
                <img className='logo' src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='icon'></img>
                <div className="login-wrapper">
                    <form className='login' action="/users/login" method='POST' onSubmit={this.onLogin.bind(this)}>
                        { this.state.error &&
                            <div className="alert alert-danger small text-center mt-0 p-1" role="alert">
                                {this.state.errorText}
                            </div>
                        }
                        <div className="form-group">
                            <Input size='lg' icon='fas fa-envelope' input='d-block w-100' placeholder="Correo electrónico"
                                type="email" name="email" autoComplete="username" required onChange={(ev) => {this.setState({email: ev.target.value});}}>
                            </Input>
                        </div>
                        <div className="form-group">
                            <Input size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Contraseña"
                                type="password" name="password" autoComplete="current-password" required onChange={(ev) => {this.setState({password: ev.target.value});}}>
                            </Input>
                        </div>
                        <button type="submit" className="btn btn-block btn-primary">Iniciar Sesión</button>
                        <div className="mt-2">
                            <a href="/reset" className=''>¿Has olvidado tu contraseña?</a>
                        </div>
                    </form>
                </div>
                <div className="mt-2 text-center">
                ¿No tienes cuenta? <a href="/new" className=''>Crear cuenta</a>
                </div>
            </div>
        );
    }
        
        /**
        * Gestionar el submit contra la API rest
        * @param {*} ev 
        */
        async onLogin(ev) {
            try {
                // Prevengo submit estandar
                ev.preventDefault();
                // Post a la API para que haga el login y nos devuelva el token
                let result = await Axios.post('/users/login/', null, {
                    data: { 
                        email: this.state.email,
                        password: this.state.password
                    }
                });
                // Si ha ido correcto cambio el estado del componente para que el usuario sea consciente
                if (result.status === 200) {
                    // Salvar el token en la sesión del navegador y redirect
                    this.props.login(result.data.user);
                    this.props.history.push('/home');
                }
            } catch (error) {
                this.setState({
                    error: true,
                    errorText: JSON.stringify(error.response)
                });   
            }
        }
    }
    
    // React-Redux
    const mapState = (state) => { 
        return {
            user: state.user, 
        };
    }
    
    const mapActions = {
        login: actions.login,
        start: actions.start,
    }
    
    const Login = connect(mapState, mapActions)(LoginAux);
    export default Login;