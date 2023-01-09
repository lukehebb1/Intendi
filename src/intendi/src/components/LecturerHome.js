import React, { PureComponent } from 'react';
import { Container, withAuthenticator } from 'aws-amplify-react';
import { configureAmplify } from "../Services";
import { API } from 'aws-amplify';
import { Card, Button, CardDeck } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import '../App.css'


class LecturerHome extends PureComponent {
	constructor(props) {
		super(props);

	}
	state = {
		moduleLst: [],
		SelectedModule : null,
		ModulePageLoad : false,
		photo : null
	};
	// On mount, make API call to get all modules
	async componentDidMount() {
		await this.fetchModules();
		this.setState({SelectedModule : null,
			ModulePageLoad : false})
	}

	// Fetch modules relevant to user api
	async fetchModules() {
		let apiName = 'VideoApi';
		let path = '/getmodules';
		let myInit = {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				"sub": this.props.authData.attributes.sub,
			}
		}
		API.post(apiName, path, myInit).then(response => {
			this.setState({moduleLst : response})
		})
	}

	render() {
		const renderCard = (card,index) =>{
			return(
				<div>
				<br></br>
				<Card style={{ width: '18rem' }} bg={'light'} text={'dark'} key={index}>
				
				<Card.Img variant="top" src={card.split("~~~")[1]} alt="Module Image Header"/>
					<Card.Body>
						<Card.Title className="nav-item">{card.split("~~~")[0]}</Card.Title>
						<Link to={`/ModulePage/${card.split("~~~")[0]}`}>
                			<Button id="custom-btn" variant="info">View</Button>
              			</Link>
					</Card.Body>
				</Card>
				</div>
			)
		}
			return (
			<Container>
				<h2 className="brand-style">{((this.props.authData.attributes.email).split(".")[0]).charAt(0).toUpperCase() + ((this.props.authData.attributes.email).split(".")[0]).slice(1)} {((this.props.authData.attributes.email).split(".")[1]).charAt(0).toUpperCase() + ((this.props.authData.attributes.email).split(".")[1]).split("@")[0].slice(1)}</h2>
				<h2 className="brand-style">Your Modules</h2>
				<CardDeck style={{justifyContent:'center', alignItems:'center'}}>{this.state.moduleLst.map(renderCard)}</CardDeck>
			</Container>
		);
	}
}
configureAmplify();
export default withAuthenticator(LecturerHome);