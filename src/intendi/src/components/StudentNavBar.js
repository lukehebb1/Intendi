import React, { PureComponent } from "react";
import * as ReactBootStrap from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import { Auth } from 'aws-amplify';
import { withAuthenticator} from 'aws-amplify-react'
import '../App.css';
import { API } from 'aws-amplify';
import logo from '../images/Logo text with colour below .svg'
import logoimage from '../images/Colour logo only.svg'

class StudentNavBar extends PureComponent {
  signOut() {
    Auth.signOut();
  }

  constructor(props) {
		super(props);

	}
	state = {
		moduleLst: [],
		SelectedModule : null,
  };
  // Fetch modules on component mount
  componentDidMount() {
		this.fetchModules();
		this.setState({SelectedModule : null,
			ModulePageLoad : false})
  }
  // Init API call and post request to fetch modules
  fetchModules() {
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
  render(){
    const renderCard = (card,index) =>{
			return(
				<Link to={`/ModulePage/${card.split("~~~")[0]}`}><ReactBootStrap.NavDropdown.Item className="nav-item-list" href={`ModulePage/${card.split("~~~")[0]}`}>{card.split("~~~")[0]}</ReactBootStrap.NavDropdown.Item ></Link>
			)
		}
      return(
        <div>
        <ReactBootStrap.Navbar collapseOnSelect expand="lg" className="color-nav" variant="light">
        <div style={{position:'absolute'}}> 
      <Link to='/StudentHome'><img
        src={logo}
        width="90"
        height="110"
        className="nav-logo"
        alt="Intendi Logo"
      /><img
        src={logoimage}
        width="50"
        height="50"
        className="nav-logo-image"
        alt="Intendi Logo"
      /></Link>
      </div>
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav"  className="ml-auto"/>
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav" style={{ zIndex: 1 }}>
            <ReactBootStrap.Nav className="m-auto">
              <Link to='/StudentHome'>
                <ReactBootStrap.Nav.Link href="#StudentHome" className="nav-item">Home</ReactBootStrap.Nav.Link>
              </Link>
              <Link to='/About'>
                <ReactBootStrap.Nav.Link href="#About" className="nav-item">About</ReactBootStrap.Nav.Link>
              </Link>
              <Link to='/JoinModule'>
                <ReactBootStrap.Nav.Link href="#JoinModule" className="nav-item">Join Module</ReactBootStrap.Nav.Link>
              </Link>
              <ReactBootStrap.NavDropdown title="My Modules" id="nav-item">
              {this.state.moduleLst.map(renderCard)}
              </ReactBootStrap.NavDropdown>
                <Button id="custom-btn-signout" variant="danger" onClick={this.signOut}>Sign Out</Button>
            </ReactBootStrap.Nav>
            
          </ReactBootStrap.Navbar.Collapse>
          
        </ReactBootStrap.Navbar>
        <div className="nav-logo-line">  
        </div>
          </div>
      );
  }
}
export default withAuthenticator(StudentNavBar);