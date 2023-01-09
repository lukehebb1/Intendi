import React, { PureComponent } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { configureAmplify } from "../Services";
import { API } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import JoinLogo from '../images/ModuleJoinLogo.png'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'

class JoinModule extends PureComponent {
	constructor(props) {
		super(props);
	}
	state = {
		moduleCde: "",
		modulePass: "",
		responsey: "",
		successMessage: "",
		errorMessage:"",
	};
	// Join module api request
	joinModule = () => {
		// Check for any errors in form
		if (this.state.moduleCde === "" || (this.state.modulePass === "")) {
			this.setState({ errorMessage: `Please fill in all fields and try again.` });
			return;
		}
		this.setState({successMessage : "Checking..."});
		let apiName = 'VideoApi';
		let path = '/studentjoin';
		let myInit = {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				"SubID": this.props.authData.attributes.sub,
				"ModuleCde": this.state.moduleCde,
				"ModulePass": this.state.modulePass,
				"Email": this.props.authData.attributes.email
			}
		}
		// Send API post request
		API.post(apiName, path, myInit)
		.then(response => {
			this.setState({successMessage : response});
		}).catch((error) => this.setState({ error:"Error Joining Module. Please Try Again"}));
		
		this.setState({
			moduleCde: "",
			modulePass: ""
		});
	};
	render() {
		return (
			<Container style={{width:'30%'}}>
				<Image src={JoinLogo} width="100%"></Image>
				{!!this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage}</Alert>}
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Module Code</Form.Label>
						<Form.Control type="input" placeholder="Enter Module Code" onChange={e =>
							this.setState({
								moduleCde: e.target.value,
								errorMessage:"",
								successMessage:""
							})
						} />
					</Form.Group>

					<Form.Group controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" onChange={e =>
							this.setState({
								modulePass: e.target.value,
								errorMessage:"",
								successMessage:""
							})} />
					</Form.Group>
					<Button id="custom-btn" variant="primary" onClick={this.joinModule}>
						Enroll
  					</Button>
				</Form>
				{!!this.state.successMessage && <Alert variant="success">{this.state.successMessage}</Alert>}
			</Container>
		);
	}
}
configureAmplify();
export default withAuthenticator(JoinModule);