import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import backbutton from '../images/backbutton.png';
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import Logo from '../images/Full Logo.svg';
import SideOne from '../images/SignInBorder2.jpeg';
import SideTwo from '../images/SignInBorder1.jpeg';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import '../App.css';
class MySignIn extends Component {

    state = {
        SignUp: false,
        SignIn: true,
        ForgotPass: false,
        verify: false,
        email: "",
        password: "",
        passwordconfirm: "",
        code: "",
        Resend: false,
        passwordMatchMessage: "",
        error: ""
    };

    // Handle submission of sign in form
    handleSubmit = event => {
        event.preventDefault();
        this.setState({ error:""});

        if (this.state.email === "" || this.state.password === "") {
            this.setState({ error:"Please enter all fields and try again."})
            return
        } else {
            Auth.signIn(this.state.email, this.state.password)
                .then(response => {
                    console.log('Sign In success');
                })
                .catch(() => {
                    this.setState({ error:"Please check your email and password and try again."});
                });
        }
    }

    // Handle email verification code
    handleVerification = event => {
        event.preventDefault();
        this.setState({ error:""});
        if (this.state.email === "" || this.state.code === "") {
            this.setState({ error:"Please enter all fields and try again."})
            return
        } else {
            // After retrieveing the confirmation code from the user
            Auth.confirmSignUp(this.state.email, this.state.code, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            })
                .then(() => { this.setState({ code: "" }) })
                .then(() => this.setState({ verify: false, SignIn: true, password: "", email: "", code: "",error:"Thank You. You may now login to your account." }))
                .catch((error)=> {
                    this.setState({ error:"Error verifying. Please try code again: " + error});
                });
        }
    };

    handleEmailChange = (e) => {
        if (e.target.value !== "") {
            this.setState({ email: e.target.value,error:"" });
        }
    }
    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value,error:""  });
    }

    handleConfirmPasswordChange = (e) => {
        this.setState({ passwordconfirm: e.target.value });

        if (this.state.password !== e.target.value) {
            this.setState({ passwordMatchMessage: "Passwords do not match." });
        } else {
            this.setState({ passwordMatchMessage: "" });
        }
    }

    handleCodeChange = (e) => {
        this.setState({ code: e.target.value,error:""  });
    }
    // Handle the sign up of new users
    handleSignUp = event => {
        event.preventDefault();
        this.setState({ error:""});
        if (this.state.password !== this.state.passwordconfirm) {
            this.setState({ error: "Passwords entered do not match" });
            return;
        }

        if (this.state.password.length < 8) {
            this.setState({ error: "Password is less than 8 characters"});
            return;
        }

        if (this.state.email === "" || this.state.password === "") {
            this.setState({ error: "Please enter all fields"});
            return;
        } else {
            try {
                Auth.signUp({
                    username: this.state.email,
                    password: this.state.password,
                }).then(this.setState({ verify: true, SignUp: false }))
                    .catch(err => this.setState({ error: "Error signing up"}));

            } catch (e) {
                this.setState({ error: "Error signing up"})
            }
        }
    };

    // Handle the resetting of passwords
    handleForgotPass = event => {
        event.preventDefault();
        this.setState({ error:""});
        if (this.state.email === "") {
            this.setState({ error: "Please enter all fields"})
        } else {
            try {
                Auth.forgotPassword(this.state.email)
                    .then(this.setState({ verify: true }))
                    .catch((error) => this.setState({ error:"Error. Make sure you entered correct email and please try again."}));
            } catch (e) {
                this.setState({ error:"Error signing Up. Please try again"});

            }
        }

    };
    // Handle the resetting of passwords
    ConfirmChangePass = event => {
        event.preventDefault();
        this.setState({ error:""});
        if (this.state.password.length < 8) {
            this.setState({ error:"Password is less than 8 Characters"});
            return;
        }
        if (this.state.email === "" || this.state.password === "" || this.state.code === "") {
            this.setState({ error:"Please enter all fields"});
        } else {
            try {
                Auth.forgotPasswordSubmit(this.state.email, this.state.code, this.state.password)
                    .then(this.setState({ ForgotPass: false, SignIn: true, verify: false, password: "", email: "", code: "" }))
                    .catch((error) => this.setState({ error:"Error Changing Password: " + error}));
            } catch (e) {
                this.setState({ error:"Error changing Password. Please try again"});
            }
        }

    };


    ResendConfirmation = event => {
        event.preventDefault();
        this.setState({ error:""});
        if (this.state.email === "") {
            this.setState({ error:"Email unknown"});
        } else {
            try {
                Auth.resendSignUp(this.state.email);
                console.log('Code resent successfully');
            } catch (err) {
                console.log('Error resending code: ', err);
            }
        }

    };

    UserSignUp = () => {
        this.setState({ SignUp: true, SignIn: false, password: "", email: "", code: "",error:"" });
    }

    ForgotPass = () => {
        this.setState({ ForgotPass: true, SignIn: false, password: "", email: "", code: "",error:""  });
    }

    Goback = () => {
        this.setState({ SignUp: false, SignIn: true, verify: false, ForgotPass: false, password: "", email: "", code: "",error:"" });
    }
    render() {

        if (this.state.SignIn === true) {
            
            return (
                // Sign in

                <div width="100%" style={{overflow:"hidden",padding: "0"}}>

                    <Row>

                        <Col ><Image src={SideTwo} width="100%" height="100%" alt="decorative design"></Image></Col>
                        <Col xs="auto">
                            {!!this.state.error && <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>}
                            <Form>
                                <Image src={Logo} width="100%" height="350" alt="Intendi Logo"></Image>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.handleEmailChange} />
                                    <Form.Text className="text-muted">
                                        We will never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                                </Form.Group>
                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.handleSubmit}>
                                    Sign In
                                </Button >
                                <br></br>
                                <br></br>
                                <a className="hvr-pop" id="custom-a-label" onClick={this.UserSignUp}>Create an Account</a>
                                <br></br>
                                <a className="hvr-pop" id="custom-a-label" onClick={this.ForgotPass}>Forgot Password</a>
                            </Form>
                        </Col>
                        <Col><Image src={SideOne} width="100%" height="100%" alt="decorative design"></Image></Col>
                    </Row>

                </div>
            );

        } else if (this.state.SignUp === true) {
            return (
                // Sign up
                <div width="100%">
                    <Row>
                        <Col ><Image src={SideTwo} width="100%" height="150%" alt="decorative design"></Image></Col>

                        <Col xs="auto">
                        {!!this.state.error && <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>}
                            <Image src={Logo} width="100%" height="350" alt="Intendi Logo"></Image>
                            <Button variant="link"><img alt='Back Button' src={backbutton} style={{ width: 30, height: 30, borderRadius: 400 / 2 }} onClick={this.Goback}></img></Button>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>DCU Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="DCU Email" name="email" value={this.state.email} onChange={this.handleEmailChange} />
                                    <Form.Text className="text-muted">
                                        We will never share your email with anyone else.
                        </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password- MIN 8 Characters" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPasswordrenter">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Re-enter Password" name="passwordconfirm" value={this.state.passwordconfirm} onChange={this.handleConfirmPasswordChange} />
                                    <p style={{ color: 'red' }}>{this.state.passwordMatchMessage}</p>
                                </Form.Group>
                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.handleSignUp}>
                                    Sign Up
                        </Button >

                            </Form>

                        </Col>

                        <Col><Image src={SideOne} width="100%" height="150%" alt="decorative design"></Image></Col>
                    </Row>

                </div>

            );
        } else if (this.state.ForgotPass === true && this.state.verify === false) {
            // Forgotten password first page
            return (
                <div width="100%">
                    <Row>

                        <Col ><Image src={SideTwo} width="100%" height="150%" alt="decorative design"></Image></Col>
                        <Col xs="auto">
                        {!!this.state.error && <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>}
                            <Image src={Logo} width="100%" height="350" alt="Intendi Logo"></Image>
                            <Button variant="link"><img alt='Back Button' src={backbutton} style={{ width: 30, height: 30, borderRadius: 400 / 2 }} onClick={this.Goback}></img></Button>

                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Registered Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="DCU Email" name="email" value={this.state.email} onChange={this.handleEmailChange} />

                                </Form.Group>

                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.handleForgotPass}>
                                    Change Password
                        </Button >

                            </Form>
                        </Col>
                        <Col><Image src={SideOne} width="100%" height="150%" alt="decorative design"></Image></Col>
                    </Row>

                </div>

            );
        } else if (this.state.verify === true && this.state.ForgotPass === false) {
            // Sign up verification page
            return (
                <div width="100%">
                    <Row>

                        <Col ><Image src={SideTwo} width="100%" height="150%" alt="decorative design"></Image></Col>
                        <Col xs="auto">
                        {!!this.state.error && <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>}
                            <Image src={Logo} width="100%" height="350" alt="Intendi Logo"></Image>
                            <Button variant="link"><img alt='Back Button' src={backbutton} style={{ width: 30, height: 30, borderRadius: 400 / 2 }} onClick={this.Goback}></img></Button>

                            <Form>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Verification Code</Form.Label>
                                    <Form.Control type="password" placeholder="Code" name="password" value={this.state.code} onChange={this.handleCodeChange} />
                                </Form.Group>

                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.handleVerification}>
                                    Verify
                        </Button >
                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.ResendConfirmation}>
                                    Resend Code
                        </Button >

                            </Form>
                        </Col>
                        <Col><Image src={SideOne} width="100%" height="150%" alt="decorative design"></Image></Col>
                    </Row>

                </div>

            );
        } else if (this.state.verify === true && this.state.ForgotPass === true) {
            // Forgot password verification
            return (
                <div width="100%">
                    <Row>

                        <Col ><Image src={SideTwo} width="100%" height="150%" alt="decorative design"></Image></Col>
                        <Col xs="auto">
                        {!!this.state.error && <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>}
                            <Image src={Logo} width="100%" height="350" alt="Intendi Logo"></Image>
                            <Button variant="link"><img alt='Back Button' src={backbutton} style={{ width: 30, height: 30, borderRadius: 400 / 2 }} onClick={this.Goback}></img></Button>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Registered Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="DCU Email" name="email" value={this.state.email} onChange={this.handleEmailChange} />

                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password- MIN 8 Characters" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Verification Code</Form.Label>
                                    <Form.Control type="password" placeholder="Code" name="password" value={this.state.code} onChange={this.handleCodeChange} />
                                </Form.Group>

                                <Button id="custom-btn" variant="primary" type="submit" onClick={this.ConfirmChangePass}>
                                    Change Password
                        </Button >
                            </Form>
                        </Col>
                        <Col><Image src={SideOne} width="100%" height="150%" alt="decorative design"></Image></Col>
                    </Row>

                </div>

            );
        }
    }

}

export default MySignIn