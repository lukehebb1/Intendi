import React, { PureComponent } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { configureAmplify } from "../Services";
import { API } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'react-bootstrap/Image'
import ImageHeader from '../images/CreateLectureLogo.png'
import Alert from 'react-bootstrap/Alert'
import '../App.css';

class CreateModule extends PureComponent {

	constructor(props) {
		super(props);
	}
	state = {
		moduleCde: "",
		modulePass: "",
		responsey: "",
		successMessage: "",
		errorMessage:"",
		modimages:["8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png","24.png","25.png","26.png","27.png","28.png","29.png","30.png","31.png"],
		chosenimage : "nothing",
		bucketurl : "https://lecturevideos132409-intendinew.s3-eu-west-1.amazonaws.com/modimages/"
	};
	// Attempt to call API to upload new module info
	uploadModule = () => {
		this.setState({ responsey: "Checking..." });
		// Make sure form is fully filled in
		if (this.state.moduleCde === "" || this.state.modulePass === ""  || (this.state.chosenimage === "nothing")) {
			this.setState({ errorMessage: "Please fill in all fields and try again." });
			return
		}
		// Init API call and post request
		let apiName = 'VideoApi';
		let path = '/usermodule';
		let myInit = {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				"SubID": this.props.authData.attributes.sub,
				"ModuleCde": this.state.moduleCde.toUpperCase(),
				"ModulePass": this.state.modulePass,
				"Background" :  this.state.bucketurl + this.state.chosenimage
			}
		}
		API.post(apiName, path, myInit).then(response => {
			this.setState({ responsey: response,successMessage:response });
		})

		this.setState({
			moduleCde: "",
			modulePass: ""
		});
		// Force a re-render
		this.forceUpdate()
	};

	// Set chosen image to state variable
	testmod = (value) => {
		this.setState({chosenimage:value})
	}

	render() {
		// Render cards off all available background images with amp function
		 const renderCarousel = (value) =>{
			return(
				<Carousel.Item>
					
					<Carousel.Caption></Carousel.Caption>
					<img
						className="d-block w-100"
						src={"https://lecturevideos132409-intendinew.s3-eu-west-1.amazonaws.com/modimages/" + value}
						alt={value}
					/>
				
				<Button id="custom-btn" variant="info"  style={{position:"relative",top:"55%",width:"100%",textAlign:"center"}}onClick={() => this.testmod(value)}>Choose</Button>
				</Carousel.Item>
			)
		}
		return (
			<Container style={{ width: '30%'}}>
				<Image src={ImageHeader} width="100%" style={{paddingBottom:15}} alt="Create a Module" aria-label="Create a Module"></Image>
				{!!this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage}</Alert>}
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Module Code</Form.Label>
						<Form.Control type="input" placeholder="Enter Module Code" onChange={e =>
							this.setState({
								moduleCde: e.target.value,
								errorMessage:""
							})
						} />
					</Form.Group>

					<Form.Group controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" onChange={e =>
							this.setState({
								modulePass: e.target.value,
								errorMessage:""
							})} />
					</Form.Group>
					<Form.Label>Choose a Background</Form.Label>
					{this.state.chosenimage !== "nothing" &&
					
        			<Image  src={this.state.bucketurl + this.state.chosenimage} thumbnail height="80px" width="80px">
        			</Image >
      				}
					<Carousel interval={null} indicators={false}>
					{this.state.modimages.map(renderCarousel)}	
					</Carousel>
				<br></br>
				
				<Button id="custom-btn" variant="primary" onClick={this.uploadModule}>
						Create Module
  				</Button>
				</Form>
				{!!this.state.successMessage && <Alert variant="success">{this.state.successMessage}</Alert>}
			</Container>
		);
	}
}
configureAmplify();
export default withAuthenticator(CreateModule);