/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import css */
import './Styles.css';


class ResetRequestAux extends React.Component {
    
    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div class="alert alert-info small text-center" role="alert">
                    This site uses cookies for manage user session. By continuing to browse this site, you agree to this use.
                </div>
                <img class='logo' src={`${process.env.PUBLIC_URL}/img/wl_icon.png`} alt='icon'></img>
                <div className="login-wrapper">
                    <h4>¿Has olvidado tu contraseña?</h4>
                    <p class="small">No te preocupes. Escribe tu dirección de correo electrónico y te enviaremos las instrucciones para restablecerla.</p>
                    <form class='login' action="/users/reset" method='POST'>
                        <div class="form-group">
                            <input type="email" name="email" class="form-control" id="email" placeholder="Correo electrónico"></input>
                        </div>
                        <button type="submit" class="btn btn-block btn-primary">Solicitar restablecer contraseña</button>
                        <div class="mt-2">
                            ¿Ya tienes una cuenta? <a href="/" class=''>Iniciar sesión</a>
                        </div>
                    </form>
                </div>
            </div>
        );
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