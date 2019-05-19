/* Import node modules */
import React from 'react';
/* Import own modules */
import './CircleLinks.css';

export class SocialLinks extends React.Component {

    render() {
        return (
            <div className={`social-icons-panel ${this.props.className}`}>
                <CircleLink url="https://www.facebook.com/autodeluxegarage/" img="social/facebook.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://www.instagram.com/autodeluxegarage/" img="social/instagram.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://www.coches.net/concesionario/autodeluxegarage/" img="social/cochesnet.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://www.milanuncios.com/tienda/auto-deluxe-garage-46663.htm" img="social/milanuncios.png" className={`social-icon inner-border`}/>
                <CircleLink url="tel:+34600971762" img="social/phone.png" className={`social-icon inner-border`}/>
                <a href="tel:+34600971762" className="social-phone">Tel. 600971762</a>
            </div>
        );
    }
}

export class TechLinks extends React.Component {

    render() {
        return (
            <div className={`${this.props.className} social-icons-panel`}>
                <CircleLink url="https://www.mongodb.com/" img="tech/mongo.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://expressjs.com/" img="tech/express.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://reactjs.org/" img="tech/react.png" className={`social-icon inner-border`}/>
                <CircleLink url="https://nodejs.org/en/" img="tech/node.png" className={`social-icon inner-border`}/>
            </div>
        );
    }
}

export class CircleLink extends React.Component {
    render() {
        return(
            <a href={this.props.url} target="_blank" rel="noopener noreferrer" className={this.props.className}>
                    <img src={`${process.env.PUBLIC_URL}/img/${this.props.img}`} alt="social-icon" />
            </a>
        );
    }
}