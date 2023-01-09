import React, { PureComponent } from "react";
import { configureAmplify, SetS3Config } from "../Services";
import { withAuthenticator } from 'aws-amplify-react';
import Storage from "@aws-amplify/storage";
import uuid from 'react-uuid';
import { API } from 'aws-amplify';
import Select from 'react-select';
import '../App.css';
import UploadLogo from '../images/Logo_Header_Upload.png'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'


class Upload extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    imageName: "",
    imageFile: "",
    response: "",
    moduleCde: "",
    week: "",
    title: "",
    UploaderID: "",
    UploaderEmail: "",
    Description:"",
    moduleLst: [],
    selectedModuleOption: null,
    selectedWeekOption: null,
    successMessage: "",
		errorMessage:"",
  };

  // Fetch modules on component mount
  componentDidMount() {
    this.fetchModules();
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
      this.setState({ moduleLst: response })
    })
  }

  // Upload screenshot to S3 bucket and screenshot info 
  uploadImage = () => {
    if (this.state.moduleCde === "" | this.state.title === "" | this.state.imageFile === "") {
      this.setState({ errorMessage: `Please fill in all fields and try again.` });
      return;
    }
    SetS3Config("lecturevideos132409-intendinew", "public");
    Storage.put(`videos/${this.state.imageName + '.mp4'}`,
      this.upload.files[0],
      { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        this.setState({ successMessage: "Success uploading Lecture!" });
      })
      .catch(err => {
        this.setState({ errorMessage: `Cannot upload file: ${err}` });
      });

    let apiName = 'VideoApi';
    let path = '/video';
    let myInit = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "VideoID": this.state.imageName,
        "ModuleCde": this.state.moduleCde,
        "Week": this.state.week,
        "Title": this.state.title,
        "UploaderID": this.props.authData.attributes.sub,
        "UploaderEmail": this.props.authData.attributes.email,
        "Description": this.state.Description
      }
    }
    API.post(apiName, path, myInit).then(response => {
      console.log(response)
    })

    this.setState({
      imageName: "",
      imageFile: "",
      response: "",
      moduleCde: "",
      week: "",
      title: "",
      UploaderID: "",
      UploaderEmail: ""
    });
  };
  handleModuleChange = selectedModuleOption => {
    this.setState({ selectedModuleOption});
    this.setState({moduleCde : selectedModuleOption.value,
      errorMessage:""});
    
  };

  handleWeekChange = selectedWeekOption => {
    this.setState({ selectedWeekOption});
    this.setState({week : selectedWeekOption.value,
      errorMessage:""});
    
  };

  render() {
    const { selectedModuleOption } = this.state;
    const { selectedWeekOption } = this.state; 
    var weekList = [];
    for(var i = 1; i < 13; i++){
      weekList.push({label: `Week ${i}`, value: `Week ${i}`})
    }
    var modList = [];
    this.state.moduleLst.forEach(function (element) {
      modList.push({ label: element.split("~~~")[0], value: element.split("~~~")[0] })
    });
    
    return (
      
      <Container style={{width: '30%'}}>
        <Row>
          <Image src={UploadLogo} width="100%" alt="Upload a Lecture" aria-label="Upload a Lecture"></Image>
        </Row>

        <Row>
        <Col><Form.Label>File</Form.Label>
        <Form.File
          type="file"
          accept="video/*"
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: uuid(),
              errorMessage:""
            })
          }
          aria-label="Choose a file"
          
        />

        <br></br>
          <Form.Label for="ModuleCde">Module Code</Form.Label>
           <Select
            value={selectedModuleOption}
            onChange={this.handleModuleChange}
            options={modList}
            aria-label="Module Code"
            
            
          />
          <br></br>
          <Form.Label for="Week">Week</Form.Label>
            <Select
            value={selectedWeekOption}
            onChange={this.handleWeekChange}
            options={weekList}
            aria-label="Choose a Week"
            
          />
          <br></br>
          <Form.Label for="Title">Video Title</Form.Label>
          <Form.Control type="text" id="Title" name="Title" value={this.state.title}
            onChange={e =>
              this.setState({
                title: e.target.value,
                errorMessage:""
              })
            } required></Form.Control></Col>

      <Col>   
      <Form.Label>Video Description</Form.Label>
            <Form.Control as="textarea" rows={3} id="Description" name="Description" value={this.state.Description} onChange={e =>
              this.setState({
                Description: e.target.value,
                errorMessage:""
              })
            }/>
            <br></br>
            <br></br>
            <Button id="custom-btn" onClick={this.uploadImage}> Upload File </Button>
        </Col>
        </Row>
        <Row>
          
        </Row>

        {!!this.state.errorMessage && <Alert variant="danger">{this.state.errorMessage}</Alert>}
        {!!this.state.successMessage && <Alert variant="success">{this.state.successMessage}</Alert>}

      </Container>
      
    );
  }
}

configureAmplify();
export default withAuthenticator(Upload);