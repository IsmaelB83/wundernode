/* Import node modules */
import React from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'
/* Import own modules */
import Input from '../../components/Inputs/Input';
/* Import css */
import './Styles.css';


/**
 * Componente react para hacer login en la aplicación
 */
export default class NewUser extends React.Component {

    /**
     * Constructor
     */
    constructor(props) { 
        super(props);
        this.state = {
            error: false,
            errorText: '',
            created: false,
        };
    }

    /**
     * Render 
     */
    render() {
        return (
            <div>
                { this.state.redirect && <Redirect to='/login' /> }
                <div className="alert alert-info small text-center" role="alert">
                    This site uses cookies for manage user session. By continuing to browse this site, you agree to this use.
                </div>
                <img className='logo' src={`${process.env.PUBLIC_URL}/img/nodejs.jpg`} alt='icon'></img>
                <div className="login-wrapper">
                    { !this.state.created &&
                        <form className='new' action="/users/" method='POST' onSubmit={this.onCreate.bind(this)}>
                            { this.state.error &&
                                <div className="alert alert-danger small text-center mt-0 p-1" role="alert">
                                    {this.state.errorText}
                                </div>
                            }
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-user' input='d-block w-100' placeholder="Nombre de usuario"
                                    type="name" name="name" required onChange={(ev) => {this.setState({name: ev.target.value});}}>
                                </Input>
                            </div>
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-envelope' input='d-block w-100' placeholder="Correo electrónico"
                                    type="email" name="email" autoComplete="username" required onChange={(ev) => {this.setState({email: ev.target.value});}}>
                                </Input>
                            </div>
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Contraseña"
                                    type="password" name="password" autoComplete="new-password" required onChange={(ev) => {this.setState({password: ev.target.value});}}>
                                </Input>
                            </div>
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Repite la contraseña"
                                    type="password" name="passwordB" autoComplete="new-password" required onChange={(ev) => {this.setState({passwordB: ev.target.value});}}>
                                </Input>
                            </div>
                            <button type="submit" className="btn btn-block btn-primary">Crear cuenta</button>
                        </form>
                    }
                    { this.state.created && 
                        <div>
                            <h4>Se ha creado la cuenta</h4>
                            <p className="small">Revise el correo electrónico para activar su cuenta de usuario.</p>
                        </div>
                    }
                </div>
                <div className="mt-2 text-center">
                    ¿Ya tienes cuenta? <a href="/" className=''>Iniciar sesión</a>
                </div>
            </div>
        );
    }

    /**
     * Gestionar el submit contra la API rest
     * @param {*} ev 
     */
    async onCreate(ev) {
        try {
            // Prevengo submit estandar
            ev.preventDefault();
            if (this.state.password !== this.state.passwordB) {
                this.setState({
                    error: true,
                    errorText: "Los passwords indicados no son iguales"
                });
                return;
            }
            // Post a la API para que haga el login y nos devuelva el token
            let result = await Axios.post('/users/', null, {
                data: { 
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                }
            });
            // Si ha ido correcto cambio el estado del componente para que el usuario sea consciente
            if (result.status === 201) {
                this.setState({created: true});
            } else {
                this.setState({
                    error: true,
                    errorText: result.data.description 
                });
            }
        } catch (error) {
            this.setState({
                error: true,
                errorText: 'Error creando usuario'
            });
        }
    }
}