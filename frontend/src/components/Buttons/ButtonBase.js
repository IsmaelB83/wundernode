/* Import node modules */
import React from 'react';
/* Import own modules */
import './Buttons.css';

export default class ButtonBase extends React.Component {
    
    constructor(props) {
        super(props);
        this.button = React.createRef();
        this.state = {
            disabled: this.props.disabled,
        }
    }

    render() {
        return (
            <button ref={this.button}
                    className={`buttonBase ${this.props.className} button--${this.props.color}`} 
                    disabled={this.state.disabled}
                    onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    };

    enable(state) {
        this.setState({
            disabled: state
        });
    }
}