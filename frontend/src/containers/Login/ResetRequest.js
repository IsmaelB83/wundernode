/* Import node modules */
import Axios from 'axios'
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import css */
import './Styles.css';


class ResetRequestAux extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            reset: false,
            error: false
        }
    }

    render() {
        return (
            <div>
                <div className="alert alert-info small text-center" role="alert">
                    This site uses cookies for manage user session. By continuing to browse this site, you agree to this use.
                </div>
                <img className='logo' src={`${process.env.PUBLIC_URL}/img/wl_icon.png`} alt='icon'></img>
                <div className="login-wrapper">
                    { !this.state.reset && 
                        <div>
                            <h4>¿Has olvidado tu contraseña?</h4>
                            <p className="small">No te preocupes. Escribe tu dirección de correo electrónico y te enviaremos las instrucciones para restablecerla.</p>
                            <form className='login' action="/users/reset" method='POST'>
                                { this.state.error &&
                                    <div className="alert alert-danger small text-center mt-2 p-1" role="alert">
                                        El email introducido es incorrecto
                                    </div>
                                }
                                <div className="form-group">
                                    <input type="email" name="email" className="form-control" id="email" placeholder="Correo electrónico" onChange={this.onChangeEmail.bind(this)}></input>
                                </div>
                                <button type="submit" className="btn btn-block btn-primary" onClick={this.resetPassword.bind(this)}> Solicitar restablecer contraseña</button>
                            </form>
                            <div className="mt-2">
                                ¿Ya tienes una cuenta? <a href="/" className=''>Iniciar sesión</a>
                            </div>
                        </div>
                    }
                    { this.state.reset && 
                        <div>
                            <h4>Se ha restablecido la contraseña</h4>
                            <p className="small">Consulta las instrucciones para restablecer la contraseña en tu correo electrónico.</p>
                            <div className="mt-2">
                                ¿Quieres volver a intentarlo? <a href="/" className=''>Volver</a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    onChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    async resetPassword(ev) {
        try {
            // Prevengo submit estandar
            ev.preventDefault();
            // Post a la API para que envíe el mail
            let result = await Axios.post('/users/reset/', null, {
                data: { email: this.state.email }
            });
            // Si ha ido correcto cambio el estado del componente para que el usuario sea consciente
            if (result.status === 200) {
                this.setState({
                    reset: true,
                    error: false
                });
            }
        } catch (error) {
            this.setState({error: true});
        }
    }
}

// React-Redux
const mapState = (state) => { 
    return { 
        lists: state.lists,
    };
};
const mapActions = {
    init: actions.init,
    loadList: actions.loadList
}

const ResetRequest = connect(mapState, mapActions)(ResetRequestAux);
export default ResetRequest;