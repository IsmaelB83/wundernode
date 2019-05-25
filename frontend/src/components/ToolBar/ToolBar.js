/* Import node modules */
import React from 'react';
/* Import own modules */
import './ToolBar.css';

export default class ToolBar extends React.Component {
  
    render() {
        return (
            <div className="list-toolbar">
                <h1 className="title">Lista compra carrefour</h1>
                <div className="actionBar">
                    <button className="btn boton--light boton--md">
                        <i className="fas fa-user-plus"><span>Share</span></i>
                    </button>
                    <button className="btn boton--light boton--md">
                        <i className="fas fa-sort"><span>Sort</span></i>
                    </button>
                    <button className="btn boton--light boton--md">
                        <i className="fas fa-ellipsis-h"><span>More</span></i>
                    </button>
                </div>
            </div>
        );
    };
}