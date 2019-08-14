/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
/* Import own modules */
import { actions } from '../../store/Store';
/* Import css */
import './Styles.css';


class ResetAux extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: 'Ismael Bernal',
        }
    }

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
                    <h4>Nueva contraseña</h4>
                    <p class='text-muted'>Hola, <b>{this.state.name}</b>: es hora de crear tu nueva contraseña de Wunderlist</p>
                    <form class='login' action="/users/reset" method='POST'>
                        <div class="form-group">
                            <input type="password" name="password" class="form-control" id="password" placeholder="Nueva contraseña"></input>
                        </div>
                        <div class="form-group">
                            <input type="password" name="password" class="form-control" id="password" placeholder="Vuelve a escribir la contraseña"></input>
                        </div>
                        <button type="submit" class="btn btn-block btn-primary">Restablecer contraseña</button>
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

const Reset = connect(mapState, mapActions)(ResetAux);
export default Reset;