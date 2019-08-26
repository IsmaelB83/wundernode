/* Import node modules */
import React, { Component } from 'react';
/* Import own modules */
/* Import own css */
import './MemberResult.css';
     

/**
* Popup modal para compartir una lista de tareas con tus amigos
*/
export default class MemberResult extends Component {

    /**
     * Render
     */
    render() {
        return  (
            <div className='member'>
                <div className='popup-owner'>   
                    <img src={this.props.avatar} alt="avatar"></img>
                    <div className='popup-ownerdata'>
                        <p className='user'>{this.props.name}
                            {!this.props.alreadyMember && <span className='member member--red'>not sent</span>}
                            { ( this.props.member || this.props.owner ) && 
                                <span className={`member member--${this.props.owner?'red':'blue'}`}>
                                    {this.props.owner?'owner':'member'}
                                </span>
                            }
                        </p>
                        <p className='email'>{this.props.email}</p>
                    </div>
                </div>
                { !this.props.owner && this.props.member &&
                    <button className='member-button' data-index={this.props.index} onClick={this.onRemove}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </button> 
                }
            </div>
        );
    }
}