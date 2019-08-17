/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
/* Import own modules */
import { actions } from '../../store/Store';
import InputIcon from '../../components/Inputs/InputIcon';
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
            error: false,
            errorText: '',
            email: '', 
            password: '',
            loading: true,
            redirect: false,
        };
    }

    /**
     * Once component is mounted
     */
    componentDidMount() {
        // Cargo el usuario del local storage si ya está logueado previamente
        let userString = localStorage.getItem('user');
        if (userString) {
            let user = JSON.parse(userString);
            if (user) {
                // Check token, update redux state and redirect to home in case is valid
                this.checkToken(user);
            }
        } else {
            this.setState({loading: false});
        }
    }

    /**
     * Render 
     */
    render() {
        return (
            <div>
                { this.state.redirect && <Redirect to='/home' /> }
                <div className="alert alert-info small text-center" role="alert">
                    This site uses cookies for manage user session. By continuing to browse this site, you agree to this use.
                </div>
                <img className='logo' src={`${process.env.PUBLIC_URL}/img/nodejs.jpg`} alt='icon'></img>
                <div className="login-wrapper">
                    { this.state.loading && <img src={`${process.env.PUBLIC_URL}/img/spinner.gif`} alt='spinner'></img> }
                    <form className='login' action="/users/login" method='POST' onSubmit={this.onLogin.bind(this)}>
                        { this.state.error &&
                            <div className="alert alert-danger small text-center mt-0 p-1" role="alert">
                                {this.state.errorText}
                            </div>
                        }
                        <div className="form-group">
                            <InputIcon size='lg' icon='fas fa-envelope' input='d-block w-100' placeholder="Correo electrónico"
                                type="email" name="email" required onChange={(ev) => {this.setState({email: ev.target.value});}}>
                            </InputIcon>
                        </div>
                        <div className="form-group">
                            <InputIcon size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Contraseña"
                                type="password" name="password" required onChange={(ev) => {this.setState({password: ev.target.value});}}>
                            </InputIcon>
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
     * Chequea la validez del token del local storage contra la API
     */
    async checkToken(user) {
        try {
            // Chequeo el token
            let result = await Axios.get('/users/login/token', {headers: {'Authorization': "bearer " + user.token}});
            // Update redux/component and redirect
            if (result && result.status === 200) {
                this.props.start(user);
                this.setState({
                    redirect: true,
                    loading: false
                });
            }
        } catch(error) {
            console.log(error);
            localStorage.clear();
            this.setState({loading: false});
        }

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
                this.setState({redirect: true});
            } else {
                this.setState({
                    error: true,
                    errorText: result.data.description 
                });
            }
        } catch (error) {
            this.setState({
                error: true,
                errorText: 'No autorizado'
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