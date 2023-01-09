import React, { PureComponent } from 'react';
import motto from '../images/About_Heading.png';
import funInfo from '../images/Fun_Info.png'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
class About extends PureComponent {

	render() {
		return (
			<Container>
				<h2 className="brand-style"> Welcome to INTENDI</h2>
				<Row>
					<Col><p className="brand-TEXT">Your number one source for education feedback analysis. We're dedicated to providing you the very best and honest feedback, with an emphasis on feedback relability, unbiased feedback and complete anonymity.</p></Col>
					<Col><img className="brand-IMAGE" src={motto} alt="Intendi Motto"></img></Col>
				</Row>
				<Row>
					<Col><img className="brand-IMAGE" src={funInfo} alt="Intendi Infographic"></img></Col>
					<Col><p className="brand-TEXT">Founded by Karl and Luke, Indenti was created due to the circumstances of Covid-19 and the shift to a digital landscape. When the founders first started out with online learning, they discovered a need for unbiased and reliable feedback for educators on their online lectures and modules. We want to provide educators with the best tool to ensure the highest engagement with their content, leaving students more satisfied and increasing module grades.</p></Col>
				</Row>
			</Container>
		);
	}
}

export default About;