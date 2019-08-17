/* Node modules */
import React from 'react';
import Axios from 'axios';
/* Own modules */
/* Import css */
import './Styles.css';

/**
 * Componente para 
 */
export default class Created extends React.Component {
    
    /**
     * Constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        let { token } = this.props.match.params
        this.state = {
            error: false,
            errorText: '',
            token: token,
            activated: false,
        }
    }

    /**
     * Componente montado
     */
    componentDidMount() {
        this.activateAccount();
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
                {   !this.state.activated &&
                    <div className="login-wrapper">
                        <h4>Activando cuenta de usuario</h4>
                        <img src={`${process.env.PUBLIC_URL}/img/spinner.gif`} alt='spinner'></img>
                    </div>
                }
                {   this.state.activated &&
                    <div className="login-wrapper">
                        <h4>Cuenta activada con éxito</h4>
                        <p className='text-muted'>Ya puede iniciar sesión con su nueva contraseña <a href="/" className=''>aquí</a></p>
                    </div>
                }
            </div>
        );
    }

    async activateAccount() {
        try {
            // Chequeo el token
            let result = await Axios.get(`/users/activate/${this.state.token}`);
            if (result && result.status === 200) {
                this.setState({
                    activated: true,
                    error: false,
                    errorText: ''
                });
            } else {
                this.setState({
                    error: true,
                    errorText: result.data.description
                });
            }
        } catch (error) {
            this.setState({
                error: true,
                errorText: error
            });
        }
    }
}