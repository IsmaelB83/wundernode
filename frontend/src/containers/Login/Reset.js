/* Node modules */
import React from 'react';
import Axios from 'axios';
/* Own modules */
import Input from '../../components/Inputs/Input';
/* Import css */
import './Styles.css';

/**
 * Componente para 
 */
export default class Reset extends React.Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        let { token } = this.props.match.params
        this.state = {
            password: '',
            passwordB: '',
            error: false,
            errorText: '',
            reset: false,
            token: token,
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
                <img className='logo' src={`${process.env.PUBLIC_URL}/img/nodejs.jpg`} alt='icon'></img>
                { !this.state.reset &&
                    <div className="login-wrapper">
                        <h4>Nueva contraseña</h4>
                        <p className='text-muted'>Es hora de crear tu nueva contraseña de Wunderlist</p>
                        <form className='login' action="/users/reset" method='POST' onSubmit={this.resetPassword.bind(this)}>
                            { this.state.error &&
                                <div className="alert alert-danger small text-center mt-0 p-1" role="alert">
                                    {this.state.errorText}
                                </div>
                            }
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Contraseña"
                                    type="password" name="password" autoComplete="new-password" required onChange={(ev) => {this.setState({password: ev.target.value});}}>
                                </Input>
                            </div>
                            <div className="form-group">
                                <Input size='lg' icon='fas fa-key' input='d-block w-100' placeholder="Contraseña"
                                    type="password" name="passwordB" autoComplete="new-password" required onChange={(ev) => {this.setState({passwordB: ev.target.value});}}>
                                </Input>
                            </div>
                            <button type="submit" className="btn btn-block btn-primary">Restablecer contraseña</button>
                            <div className="mt-2">
                                ¿Ya tienes una cuenta? <a href="/" className=''>Iniciar sesión</a>
                            </div>
                        </form>
                    </div>
                }
                { this.state.reset && 
                    <div className="login-wrapper">
                        <h4>Contraseña actualizada</h4>
                        <p className='text-muted'>Ya puede iniciar sesión con su nueva contraseña <a href="/" className=''>aquí</a></p>
                    </div>
                }
            </div>
        );
    }

    /**
     * Solicita el cambio de password cuando se hace click en el botón
     * @param {*} ev 
     */
    async resetPassword(ev) {
        try {
            // Prevengo submit estandar
            ev.preventDefault();
            // Post a la API para que envíe el mail sólo si ha escrito ambos passwords iguales
            if(this.state.password === this.state.passwordB) {
                let result = await Axios.post(`/users/reset/${this.state.token}`, null, {
                    data: { password: this.state.password }
                });
                // Si ha ido correcto cambio el estado del componente para que el usuario sea consciente
                if (result.status === 200) {
                    this.setState({
                        reset: true,
                        error: false
                    });
                } else {
                    this.setState({
                        error: true,
                        errorText: 'No se ha podido actualizar el password',
                    }) 
                }
            } else {
                this.setState({
                    error: true,
                    errorText: 'Los passwords introducidos no coinciden',
                });
            }
        } catch (error) {
            this.setState({
                error: true,
                errorText: error,
            });
        }
    }
}