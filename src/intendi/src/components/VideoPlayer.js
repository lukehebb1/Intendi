import React, { PureComponent} from 'react';
import Webcam from "react-webcam";
import { API } from 'aws-amplify';
import uuid from 'react-uuid';
import { withAuthenticator } from 'aws-amplify-react';
import { configureAmplify } from "../Services";
import { Button } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Modal from 'react-bootstrap/Modal';
import {Container} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import 'video-react/dist/video-react.css';

class VideoPlayer extends PureComponent {
    
    constructor(props) {
        super(props);
        
    }
    
    state = {
        videoTitle: this.props.Title,
        videoID: this.props.id,
        modCde:this.props.moduleCde,
        description: this.props.description,
        photo: null,
        photoTime: 0,
        WatchCheck:false,
        StudentSessionKey:uuid(),
        UserBrowser:null,
        watchday:null,
        WatchTime:null,
        WatchDate:null,
        UserOnTab : true,
        VideoMute: false,
        show: false,
        setShow:false,
        VideoEnded:false,
        value:2,
        setValue:2,
        hover:-1,
        setHover:-1,
        feedback:"",
        error: "",
        webcamEnabled:true,
        firstplay:true
    };
    // Set video player reference
    playerRef = player => {
        this.player = player

      }
    // When component mounts get user browser, day and time of day
    async componentDidMount() {

        function msToTime(s) {
            var pad = (n, z = 2) => ('00' + n).slice(-z);
            return pad(s/3.6e6 + 1|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0) + '.' + pad(s%1000, 3);
          }
        window.addEventListener('blur', this.onBlur)
        function get_browser() {
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
                return {name:'IE',version:(tem[1]||'')};
                }   
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR|Edge\/(\d+)/)
                if(tem!=null)   {return {name:'Opera', version:tem[1]};}
                }   
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            return {
              name: M[0],
              version: M[1]
            };
         }
        var d=new Date();
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear();
        var browser=get_browser();
        var dateStr = date + "/" + month + "/" + year;
        var weekday=new Array(7);
        weekday[0]="Sunday";
        weekday[1]="Monday";
        weekday[2]="Tuesday";
        weekday[3]="Wednesday";
        weekday[4]="Thursday";
        weekday[5]="Friday";
        weekday[6]="Saturday";
        this.setState({UserBrowser:browser.name,watchday:weekday[d.getDay()],WatchTime:msToTime(d.getTime() % 8.64e7) ,WatchDate:dateStr})
        window.addEventListener('blur', this.onBlur)
        window.addEventListener('focus', this.onFocus)
        
    }

    // Set webcam reference
    setRef = (webcam) => {
        this.webcam = webcam;
    };

    // // Init API call and post request to send watch info and screenshot info to db
    capture = () => {
        if (this.state.WatchCheck === false){
            this.startTime = new Date() * 1;
            let apiName = 'VideoApi';
		    let path = '/studentwatchcount';
		    let myInit = {
			    headers: {
				    'Content-Type': 'application/json'
			},
			    body: {
                    "SubID": this.props.authData.attributes.sub,
                    "VideoID": this.state.videoID,
                    "ModuleCde":this.state.modCde,
                    "Browser":this.state.UserBrowser,
                    "WatchLength":0,
                    "WatchDay":this.state.watchday,
                    "WatchTime":this.state.WatchTime,
                    "WatchDate":this.state.WatchDate,
                    "thisUID":this.state.StudentSessionKey
			}
		}
		    API.post(apiName, path, myInit).then(response => {
                this.setState({WatchCheck:true})
        })
            
        }
        if (this.state.VideoEnded === false) {
            if (this.state.firstplay === false){
                this.setState({photo:this.webcam.getScreenshot()})
                this.setState({photoTime:this.player.currentTime})
            }else{
                this.setState({photoTime:0})
            }
            
            let apiName = 'VideoApi';
		    let path = '/ScreenshotUpload';
		    let myInit = {
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
                "Image": this.state.photo,
                "id": uuid(),
                "VideoID": this.state.videoID,
                "ImageTime": this.state.photoTime,
                "UserOnTab": this.state.UserOnTab,
                "VideoMute": this.state.VideoMute
			}
		}
		    API.post(apiName, path, myInit).then(response => {
        })
            this.intervalid = setTimeout(() => this.capture(), 10000);
        }
        
        
    }
    // Begin capturing
    begincapture = () => {
        if (this.state.firstplay == true) {
            this.capture();
            this.setState({firstplay:false})
        }
    }

    // Init API call and post request to send watch time and other info when they have left the page
    componentWillUnmount=()=>{
        let endTime = new Date() * 1;
        let elapsed = (endTime - this.startTime)/1000;
        let apiName = 'VideoApi';
        let path = '/watchtime';
        let myInit = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "VideoID": this.state.videoID,
            "StudentWatchUID":this.state.StudentSessionKey,
            "WatchTime": elapsed
        }
        }
        API.post(apiName, path, myInit).then(response => {
            
        })

        clearTimeout(this.intervalid)
        window.removeEventListener("blur", this.onBlur)
    }

    onBlur = () => {
        this.setState({UserOnTab:false})
    };

    onFocus = () => {
        this.setState({UserOnTab:true})
    }
    handlevolumechange=(e)=>{

        if (this.player.muted == true || this.player.volume == 0){
            this.setState({VideoMute:true})
        }else{
            this.setState({VideoMute:false})
        }
        
    }
    handleShow = () => {
        this.setState({show: true,VideoEnded:true});
        clearTimeout(this.intervalid);
    }
    handleClose = () => {
        this.setState({show: false,VideoEnded:true});
    }

    // Init API call and post request to submit rating and feedback
    RatingSubmit = () => {
        let apiName = 'VideoApi';
        let path = '/submitrating';
        let myInit = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "VideoID": this.state.videoID,
            "Rating": this.state.value,
            "feedbackComments": this.state.feedback
        }
        }
        API.post(apiName, path, myInit).then(response => {
            
        })
        this.setState({show: false,VideoEnded:true});
    }

    setValue = (e) => {
        this.setState({value: e});
    }

    handleNoWebcam= () =>{
        this.setState({VideoEnded:true,error:"No Webcam Found",webcamEnabled:false});
    }
    // Take screenshot every 10 seconds
    handleUserMedia = () => {
        setTimeout(() => {
          const imageSrc = this.webcam.getScreenshot();
          this.setState({photo:imageSrc});
        }, 1000);
        
      };

    setHover = (e) => {
        this.setState({hover: e});
    }
	render() {
        const videoConstraints = {
            audio: false,
            width: 70,
            height: 70,
            facingMode: "user",
           
        };
        const labels = {
            0.5: 'Useless',
            1: 'Useless+',
            1.5: 'Poor',
            2: 'Poor+',
            2.5: 'Ok',
            3: 'Ok+',
            3.5: 'Good',
            4: 'Good+',
            4.5: 'Excellent',
            5: 'Excellent+',
          };



		return (
        <Container>
            
            <div name='header' style={{display: 'flex',  justifyContent:'center', alignItems:'center', padding:'10px'}}>
             <h1>{this.state.videoTitle}</h1>
             
		    </div>

            <div name='header' style={{display: 'flex',  justifyContent:'center', alignItems:'center', padding:'10px'}}>
            {this.state.webcamEnabled ? (
                <Webcam videoConstraints={videoConstraints} ref={this.setRef} mirrored={true} screenshotFormat="image/png" screenshotQuality={1} onUserMediaError={this.handleNoWebcam} onUserMedia={this.handleUserMedia}/>
            ) : (
                <Alert variant="danger"  onClose={() => {this.setState({error:""})}} dismissible>{this.state.error}</Alert>
            )}
		    </div>
            
            <div name='video' style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <video
                ref={this.playerRef}
                src={`https://lecturevideos132409-intendinew.s3-eu-west-1.amazonaws.com/public/videos/${this.state.videoID + '.mp4'}`}
                id="videoplayer"
                width="65%" 
                height="40%" 
                controls
                onPlay={this.begincapture}
                onVolumeChange={(e) =>this.handlevolumechange(e)}
                onEnded={this.handleShow}
             >
                 
            </video>
             
            </div> 

            <Container><h3>Description: </h3>{this.state.description}</Container>
            
            <Modal
        show={this.state.show}
        onHide={this.handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
        <Modal.Title>What did you think? Don't worry it's all anonymous!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Rating
        name="hover-feedback"
        value={this.state.value}
        precision={0.5}
        onChange={(event, newValue) => {
          this.setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          this.setHover(newHover);
        }}
      />
      {this.state.value !== null && <Box ml={2}>{labels[this.state.hover !== -1 ? this.state.hover : this.state.value]}</Box>}
      <Form.Label>Any Comments or Questions?</Form.Label>
            <Form.Control as="textarea" rows={3} id="feedback" name="feedback" value={this.state.feedback} onChange={e =>
              this.setState({
                feedback: e.target.value
              })
            }/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.RatingSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
        </Container>
        );
	}
}
configureAmplify();
export default withAuthenticator(VideoPlayer);