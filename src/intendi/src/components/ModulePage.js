import React, { PureComponent } from 'react';
import { Container, withAuthenticator } from 'aws-amplify-react';
import { configureAmplify } from "../Services";
import { API } from 'aws-amplify';
import { Card, Button, CardDeck } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import '../App.css';
import Table from 'react-bootstrap/Table'
import {Link, withRouter
} from 'react-router-dom';
import backbutton from '../images/backbutton.png';
import '../App.css';
import VideoPlayer from './VideoPlayer';
import DataReport from './DataReport'
import Modal from 'react-bootstrap/Modal';

class ModulePage extends PureComponent {
    constructor(props) {
        super(props);   
    }
    // Set states
    state = {
        weekLst: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12',],
        moduleCde : this.props.match.params.id,
        Week : null,
        VideoList:[],
        data: '',
        Viewtext: "Open",
        videoShow: false,
        videoTitle: null,
        videoID: null,
        description:"",
        show: false,
        deletedshow: false,
    };

    // Fetch videos when component mounts
    async componentDidMount() {
        await this.fetchVideos();
    }
    
    async componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            // Force rerender 
            this.forceUpdate()
            await this.setState({
                moduleCde : this.props.match.params.id,
                Week : null,
                VideoList:[],
                data: '',
                videoTitle: null,
                videoID: null,
                description:"",
                videoShow:false,
                show: false,
                deletedshow: false,
            })
            await this.fetchVideos()
        }
      }

    // Init API call and post request to fetch videos 
    async fetchVideos() {
        let apiName = 'VideoApi';
		let path = '/getvidinfo';
		let myInit = {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
                "ModuleCde": this.state.moduleCde,
                "Week": this.state.Week
			}
		}
		API.post(apiName, path, myInit).then(response => {
			this.setState({VideoList : response})
        })
       

    }
    // Handle expanding on module card
    loadModule = (value) =>{
        if (this.state.Viewtext === "Open"){
            this.setState({Week : value,Viewtext : "Close"})
        }else{
            this.setState({Week : value,Viewtext : "Open"})
        }
    };
    // Handle opening of module video
    GotoModule = (value, value2, value3) =>{
        this.setState({videoShow: true, videoTitle: value, videoID: value2,description:value3})
    };
    
    // Handle video exit
    ExitVideo = () =>{
        this.setState({videoShow: false})
	};

    handleShow = () => {
        this.setState({show: true});
    }
      handleClose = () => {
        this.setState({show: false});
      }
    
      DeletedClose = () => {
        this.setState({deletedshow: false});
      }
      // Init API call and post request to delete video
      deleteVideo() {
        let apiName = 'VideoApi';
        let path = '/deletemodule';
        let myInit = {
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            "subID":  this.props.authData.attributes.sub,
            "moduleCde": this.state.moduleCde
          }
        }
        API.post(apiName, path, myInit).then(response => {
          this.setState({show: false,deletedshow:true});
        })
      }

    render() {
        var email = this.props.authData.attributes.email;
        var count = 0
        
        const renderCard = (card, index) => {
            count = count + 1
            // Enter lecturer side of application
            if (email.includes("@gmail.com")){
                // If the module has no videos
                if (this.state.VideoList.filter(item => item.Week === card).length < 1){
                    return (
                        <div>
                        <br></br>
                
                        <Accordion>
                        <Card style={{ width: '25rem',textAlign: 'center' }} bg={'light'} text={'dark'} key={index}>
                            <Card.Body>
                                <Card.Title>{card}</Card.Title>
                                <Accordion.Toggle as={Button} id="custom-btn" variant="link" eventKey={count} onClick={() => this.loadModule(card)}>
                                    Open
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={count}>
                                <Card.Body>No Videos</Card.Body>
                                </Accordion.Collapse>
                            </Card.Body>
                        </Card>
                    </Accordion>
                    </div>
                    )
                }else{
                    return (
                
                    <div>
                        <br></br>
                
                        <Accordion>
                            <Card style={{ width: '25rem',textAlign: 'center' }} bg={'light'} text={'dark'} key={index}>
                                <Card.Body>
                                    <Card.Title>{card}</Card.Title>
                                    <Accordion.Toggle as={Button} id="custom-btn" variant="link" eventKey={count} onClick={() => this.loadModule(card)}>
                                        Open
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={count}>
                                    <Card.Body><Table >{this.state.VideoList.filter(item => item.Week === card).map(item => <thead><td>{item.Title}</td><td><Button id="custom-btn"  onClick={() => this.GotoModule(item.Title, item.VideoID,item.VideoDescription)}>Feedback</Button></td></thead>)}</Table></Card.Body>
                                    </Accordion.Collapse>
                                </Card.Body>
                            </Card>
                        </Accordion>
                     
                    </div>
                )
                }
                
            }else{

                if (this.state.VideoList.filter(item => item.Week === card).length < 1){
                    return (
                
                        <div>
                            <br></br>
                    
                            <Accordion>
                                <Card style={{ width: '25rem',textAlign: 'center' }} bg={'light'} text={'dark'} key={index}>
                                    <Card.Body>
                                        <Card.Title>{card}</Card.Title>
                                        <Accordion.Toggle as={Button} id="custom-btn" variant="link" eventKey={count} onClick={() => this.loadModule(card)}>
                                            Open
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={count}>
                                        <Card.Body>No Videos</Card.Body>
                                        </Accordion.Collapse>
                                    </Card.Body>
                                </Card>
                            </Accordion>
                         
                        </div>
                         
                    )
                }else{
                     return (
                
                    <div>
                        <br></br>
                
                        <Accordion>
                            <Card style={{ width: '25rem',textAlign: 'center' }} bg={'light'} text={'dark'} key={index}>
                                <Card.Body>
                                    <Card.Title>{card}</Card.Title>
                                    <Accordion.Toggle as={Button} id="custom-btn" variant="link" eventKey={count} onClick={() => this.loadModule(card)}>
                                        Open
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={count}>
                                    <Card.Body><Table >{this.state.VideoList.filter(item => item.Week === card).map(item => <thead><td>{item.Title}</td><td><Button id="custom-btn"  onClick={() => this.GotoModule(item.Title, item.VideoID,item.VideoDescription)}>Watch</Button></td></thead>)}</Table></Card.Body>
                                    </Accordion.Collapse>
                                </Card.Body>
                            </Card>
                        </Accordion>
                     
                    </div>
                     
                )
                }
               
            }
            

        }
        if (this.state.videoShow === false){
            if (email.includes("@gmail.com")){
                // Set module statistics data and display it
                var NumOfStudents = 0
                var NumOfVideos = 0
                var TotalViews = 0
                var LeastWatchedVids = 0
                var MostWatchedVids = 0
                this.state.VideoList.forEach(function (element) {
                    if (element['NumOfStudents'] == null ){
                    }else{
                        NumOfStudents = element['NumOfStudents']
                        NumOfVideos = element['NumOfVideos']
                        TotalViews = element['TotalViews']
                        LeastWatchedVids = element['LeastWatchedVids']
                        MostWatchedVids = element['MostWatchedVids']
                    }
                });
                return (
                    <Container>
                        <Link to={`/LecturerHome`}><Button variant="link"><img alt='Back Button' src={backbutton} style={{width: 40, height: 40, borderRadius: 400/ 2}} onClick={this.ExitModule}></img></Button></Link>
                        <h1 className='ModulePageCards'>{this.props.match.params.id}</h1>
                        <p className="brand-VIDEOTEXT">Number of students: {NumOfStudents} | Number of videos: {NumOfVideos} | Total Views: {TotalViews} | Least watched videos: {LeastWatchedVids} | Most watched videos: {MostWatchedVids}</p>
                        <CardDeck style={{justifyContent: 'center', flexDirection: 'row',paddingBottom:'2%'}}>
                            {this.state.weekLst.map(renderCard)}
                        </CardDeck>
                        <div name='header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
                            <Button variant="danger" onClick={this.handleShow.bind(this)}>Delete Module</Button>
                        </div>
                        <Modal
                            show={this.state.show}
                            onHide={this.handleClose}
                            backdrop="static"
                            keyboard={false}
                            centered
                        >
                        <Modal.Header closeButton>
                        <Modal.Title>Delete Module</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
        
     
                        <h3>Are you sure you want to delete this Module? All data will be lost and all enrolled students will be kicked.</h3>

                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                        </Button>
                        <Button variant="danger" onClick={this.deleteVideo.bind(this)}>Delete</Button>
                        </Modal.Footer>
                        </Modal>

                        <Modal
                            show={this.state.deletedshow}
                            onHide={this.DeletedClose}
                            backdrop="static"
                            keyboard={false}
                            centered
                        >
                            <Modal.Header closeButton>
                            <Modal.Title>Delete Video</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            
                        
                            <h3>The Video has been deleted. Thank you.</h3>

                            </Modal.Body>
                            <Modal.Footer>
                            <Link to={`/LecturerHome/`}><Button variant="secondary" onClick={this.DeletedClose}>
                                Close
                            </Button></Link>
                            </Modal.Footer>
                        </Modal>
                    </Container>
                
                );
            }else{
                    return (
                        <Container>
                        <Link to={`/StudentHome`}><Button variant="link"><img alt='Back Button' src={backbutton} style={{width: 40, height: 40, borderRadius: 400/ 2}} onClick={this.ExitModule}></img></Button></Link>
                        <h1 className='ModulePageCards'>{this.props.match.params.id}</h1>
                        <CardDeck style={{justifyContent: 'center', flexDirection: 'row',paddingBottom:'2%'}}>
                            {this.state.weekLst.map(renderCard)}
                        </CardDeck>
                    </Container>
                        );
                }
        }else{
            // Enter student side of application
            if (email.includes("@gmail.com") || email.includes("@dcu.ie")){
                return(
                    <Container>
                    <Button variant="link"><img alt='Back Button' src={backbutton} style={{width: 40, height: 40, borderRadius: 400/ 2}} onClick={this.ExitVideo}></img></Button>
                    <DataReport Title={this.state.videoTitle} id={this.state.videoID} handler = {this.ExitVideo}/>
                    </Container>
                );
            }else{
                return(
                <Container>
                <Button variant="link"><img alt='Back Button' src={backbutton} style={{width: 40, height: 40, borderRadius: 400/ 2}} onClick={this.ExitVideo}></img></Button>
                <VideoPlayer Title={this.state.videoTitle} id={this.state.videoID} moduleCde={this.state.moduleCde} description={this.state.description}/>
                </Container>
            );
            }
            
        }
    }
}
configureAmplify();
export default withAuthenticator(withRouter(ModulePage));