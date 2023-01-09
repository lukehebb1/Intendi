import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator, AmplifyTheme, Container} from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import './App.css';
import Upload from './components/Upload';
import StudentHome from './components/StudentHome';
import LecturerHome from './components/LecturerHome';
import StudentNavBar from './components/StudentNavBar';
import LecturerNavBar from './components/LecturerNavBar';
import CreateModule from './components/CreateModule';
import JoinModule from './components/JoinModule';
import About from './components/About';
import ModulePage from './components/ModulePage'
import LoadingScreen from './components/LoadingScreen'
import MySignIn from './components/MySignIn'

Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    
  }

  state = {
		loading : true
	};

  componentDidMount(){
    if(this.state.loading === true){
			setTimeout(() => {
			this.setState({
				loading: false,
				});
			}, 1500)
		
		}
  }
  signOut() {
    Auth.signOut();
  }

  render() {
    var email = this.props.authData.attributes.email;
    if (this.state.loading === true){
			return(<Container><LoadingScreen/></Container>);
		}else{
      if (email.includes("@gmail.com") || email.includes("@dcu.ie")){
        // Enter lecturer side of application
        return (
          <div>
            <Router>
            <LecturerNavBar/>
            <Redirect to="/LecturerHome"/>
            
            <Switch>
            <Route path="/LecturerHome" component={LecturerHome}>
              <LecturerHome/>
            </Route>
            <Route path="/About" component={About}>
              <About/>
            </Route>
            <Route path="/CreateModule" component={CreateModule}>
              <CreateModule/>
            </Route>
            <Route path="/Upload" component={Upload}>
              <Upload/>
            </Route>
            <Route path="/ModulePage/:id" component={ModulePage}>
              <ModulePage/>
            </Route>
            </Switch>
            </Router>
          </div>
        );
      }else if(email.includes("@mail.dcu.ie")) {
        // Enter student side of application
        return (
          <div>
            <Router>
            <Redirect to="/StudentHome"/>
            <StudentNavBar/>
            <Switch>
            <Route path="/StudentHome" component={StudentHome}>
              <StudentHome/>
            </Route>
            <Route path="/About" component={About}>
              <About/>
            </Route>
            <Route path="/JoinModule" component={JoinModule}>
              <JoinModule/>
            </Route>
            <Route path="/ModulePage/:id" component={ModulePage}>
              <ModulePage/>
            </Route>
            </Switch>
            </Router>
          </div>
        );
      }else{
        return (
          <div>
            <button variant="outlined" color="secondary" onClick={this.signOut}>Sign Out</button>
            <p>Please use a valid DCU email to access content</p>
          </div>
        );
      }
    }
  }
}

const MyButton = Object.assign({}, AmplifyTheme.button, {
    backgroundColor: '#745342'});

const signOuty = Object.assign({}, AmplifyTheme.navButton, {
    display: 'block',
    textAlign: 'center',
    margin: 'auto',
    });

const Header = Object.assign({}, AmplifyTheme.sectionHeader, {
  backgroundColor: '#0c62ab',} );

const signInButton = Object.assign({}, AmplifyTheme.button, {
  backgroundColor: '#0c62ab',
  color: 'white',
  width: '100%',
});

const Cont = Object.assign({}, AmplifyTheme.container, {
  width: '100%',
  padding: 0,
  paddingLeft: 0,
  paddingRight: 0
});
const greeting = Object.assign({}, AmplifyTheme.navItem, {
    Color: 'white',
    textAlign: 'center',
    display: 'block',
    backgroundColor: '#745342',
    })

const navB = Object.assign({}, AmplifyTheme.navBar, {
    margin: "auto",
    width: "auto",
    fontSize: 12,
    padding: 0,
    backgroundColor: '#745342',
});

const Nav = Object.assign({}, AmplifyTheme.nav, {
    padding: 0,
    backgroundColor: '#745342',
})



const MyTheme = Object.assign({}, AmplifyTheme,
    {button:MyButton },
    {navButton:signOuty},
    {sectionHeader:Header},
    {button:signInButton},
    {navItem:greeting},
    {navBar:navB},
    {nav:Nav},
    {container:Cont}
);

export default withAuthenticator(App, false, [<MySignIn/>], null, MyTheme,

{header: 'Sign Up',
    hideAllDefaults: true,

signUpFields: [
{
  label: 'DCU Email',
  key: 'username',
  required: true,
  displayOrder: 1,
  type: 'string'
},
{
  label: 'Confirm DCU Email',
  key: 'email',
  required: true,
  displayOrder: 2,
  type: 'string'
},
{
  label: 'Password (8+Chars)',
  key: 'password',
  required: true,
  displayOrder: 3,
  type: 'password'
},
]
}
);
