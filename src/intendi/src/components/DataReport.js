import React, { PureComponent } from 'react';
import { API } from 'aws-amplify';
import '../App.css';
import ReactPlayer from 'react-player'
import { Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart, Line, ResponsiveContainer,AreaChart, Area,Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,  ZAxis, RadialBarChart, RadialBar } from 'recharts';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Image from 'react-bootstrap/Image'
import SideOne from '../images/DataReportBorder1.png';
import SideTwo from '../images/DataReportBorder2.png';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import {
  Link
} from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'
  // Init different needed lists
  var ConcentrationDict = {};
  var SumConcentrateDict =  {};
  var  CountConcentrateDict= {};
  var ConfusedOverTime = {};
  var EmotionsOverTime = {};

class DataReport extends PureComponent {

  constructor(props) {
    super(props);
  }
  

  state = {
    videoTitle: this.props.Title,
    videoID: this.props.id,
    photo: null,
    focused: true,
    dataLst: [],
    videoLength: 0,
    show: false,
    deletedshow: false,
    loading :true
  };

  // Set reference of video player
  playerRef = player => {
    this.player = player
  }

  componentDidMount() {
    // Init loading state to display loading icon
    this.startTime = new Date() * 1;
    if(this.state.loading === true){
			setTimeout(() => {
        // Fetch all video data
      this.fetchData();
			this.setState({
				loading: false,
				})
			}, 1000)
		}
  }
  // Fetch relevant data API request
  fetchData() {
    let apiName = 'VideoApi';
    let path = '/FaceDataRetrieve';
    let myInit = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "VideoID": this.state.videoID
      }
    }
    API.post(apiName, path, myInit).then(response => {
      this.setState({ dataLst: response })
    }).catch(err => {console.log("Error")})
  }
  // Handle modal show
  handleShow = () => {
    this.setState({show: true});
}
  // Handle modal close
  handleClose = () => {
    this.setState({show: false});
  }
  // Handle confirmation deleted modal show
  DeletedClose = () => {
    this.setState({deletedshow: false});
  }

  // API call to delete the relvant video and all its data
  deleteVideo() {
    let apiName = 'VideoApi';
    let path = '/deletelecture';
    let myInit = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "VideoID": this.state.videoID
      }
    }
    API.post(apiName, path, myInit).then(response => {
      this.setState({show: false,deletedshow:true});
    })
  }
  // Function to get the videos full length and dynamically add 0 -> video length into all lists for breakdown
  getvideoLength = () => {
    var vid = document.querySelector("video");
    this.setState({VideoLength:vid.duration});
    var i = 0
    // If video length <5
    if(this.state.VideoLength <= 300){
      while(i <= 300){
        ConcentrationDict[i] = 0
        SumConcentrateDict[i] = 0
        CountConcentrateDict[i] = 0
        ConfusedOverTime[i] = 0
        EmotionsOverTime[i] = {
          'HAPPY': 0,
          'SAD': 0,
          'ANGRY': 0,
          'CONFUSED': 0,
          'DISGUSTED': 0,
          'SURPRISED': 0,
          'CALM': 0,
          'UNKNOWN': 0,
          'FEAR': 0
        }
        i += 30
      }
      
    }
    // If video length >5
    else{
      while(i <= this.state.VideoLength){
        ConcentrationDict[i] = 0
        SumConcentrateDict[i] = 0
        CountConcentrateDict[i] = 0
        ConfusedOverTime[i] = 0
        EmotionsOverTime[i] = {
          'HAPPY': 0,
          'SAD': 0,
          'ANGRY': 0,
          'CONFUSED': 0,
          'DISGUSTED': 0,
          'SURPRISED': 0,
          'CALM': 0,
          'UNKNOWN': 0,
          'FEAR': 0
        }
        i += 30
      }
    }

  }
  render() {
    var dateDict = {}
    function formatDate(date){
      var dd = date.getDate();
      var mm = date.getMonth()+1;
      var yyyy = date.getFullYear();
      date = dd+'/'+mm+'/'+yyyy;
      return date
   }
   // Get last 7 days from current date
  function Last7Days () {
      for (var i=6; i>=0; i--) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          dateDict[formatDate(d) ] = 0;
      }

   }
    Last7Days();
    var emotionsList = [];
    var WatchLenList = [];
    var TimeOfDayWatchList = [];
    var studentsWatchedVideo = 0;
    var totalEnrolledStudents = 0;
    var totalVideoViews = 0
    var averageVideoWatchLength = 0
    var VideoRating = 0
    var FeedbackComments = [];
    var decimalTimeString = 0;
    var totalEmotionsRecords = 0;
    var emotionsdict = {
      'HAPPY': 0,
      'SAD': 0,
      'ANGRY': 0,
      'CONFUSED': 0,
      'DISGUSTED': 0,
      'SURPRISED': 0,
      'CALM': 0,
      'UNKNOWN': 0
    }

    var WatchLen = {
      '<1': 0,
      '1-5': 0,
      '5-10': 0,
      '10-20': 0,
      '20-30': 0,
      '30-40': 0,
      '40-50': 0,
      '>1 hour': 0
    }

    var TimeOfDayWatchDict = {
      '07a': 0,
      '08a': 0,
      '09a': 0,
      '10a': 0,
      '11a': 0,
      '12p': 0,
      '01p': 0,
      '02p': 0,
      '03p': 0,
      '04p': 0,
      '05p': 0,
      '06p': 0,
      '07p': 0,
      '08p': 0,
      '09p': 0,
      '10p': 0,
      '11p': 0,
      '00a-06a': 0,

    }

    var AlldayTimes = {
      'Monday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Tuesday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Wednesday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Thursday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Friday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Saturday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      },
      'Sunday': {
        '07a': 0,
        '08a': 0,
        '09a': 0,
        '10a': 0,
        '11a': 0,
        '12p': 0,
        '01p': 0,
        '02p': 0,
        '03p': 0,
        '04p': 0,
        '05p': 0,
        '06p': 0,
        '07p': 0,
        '08p': 0,
        '09p': 0,
        '10p': 0,
        '11p': 0,
        '00a-06a': 0,
  
      }
    }
    


    // Iterate through returned data from data retrieval and bringing processing/adding to lists
    this.state.dataLst.forEach(function (element) {
      if (element['Emotions'] in emotionsdict){
        emotionsdict[element['Emotions']] += 1;
        totalEmotionsRecords += 1;
      }
      
      if (element['Emotions'] === "CONFUSED"){
        ConfusedOverTime[Math.round((Math.round(element['Timestamp']/30)*30).toString()).toString()] += 1;
      }
      
      if (element['WatchDay'] != null){
        if (element['WatchTime'].substring(0, 2) > 12){
          if ((element['WatchTime'].substring(0, 2) - 12) > 9){
            AlldayTimes[element['WatchDay']][(element['WatchTime'].substring(0, 2) - 12) + 'p'] += 1;
          }else{
            AlldayTimes[element['WatchDay']]['0' + (element['WatchTime'].substring(0, 2) - 12) + 'p'] += 1;
          }
          
        }else{
          if (element['WatchTime'].substring(0, 2) === 12){
            AlldayTimes[element['WatchDay']]['12p'] += 1;
          }else if (element['WatchTime'].substring(0, 2) < 7){
            AlldayTimes[element['WatchDay']]['00a-06a'] += 1;
          }else{
            AlldayTimes[element['WatchDay']][(element['WatchTime'].substring(0, 2)) + 'a'] += 1;
          }
          
        }
      }
      if (element['studentsWatchedVideo'] == null ){
        
      }else{
        studentsWatchedVideo = element['studentsWatchedVideo']
        totalEnrolledStudents = element['NumStudentsEnrolled']
        totalVideoViews = element['totalVideoViews']
        decimalTimeString = Math.round(element['averageVideoWatchLength'])
        VideoRating = element['averageVideoRating']
      }
      if (element['FeedbackComments'] != null ){
        FeedbackComments = element['FeedbackComments']
      }
      if (element['WatchTime'] != null ){
        
        if (element['WatchTime'].substring(0, 2) > 12){
          if ((element['WatchTime'].substring(0, 2) - 12) > 9){
            TimeOfDayWatchDict[(element['WatchTime'].substring(0, 2) - 12) + 'p'] += 1;
          }else{
            TimeOfDayWatchDict['0' + (element['WatchTime'].substring(0, 2) - 12) + 'p'] += 1;
          }
          
        }else{
          if (element['WatchTime'].substring(0, 2) === 12){
            TimeOfDayWatchDict['12p'] += 1;
          }else if (element['WatchTime'].substring(0, 2) < 7){
            TimeOfDayWatchDict['00a-06a'] += 1;
          }else{
            TimeOfDayWatchDict[(element['WatchTime'].substring(0, 2)) + 'a'] += 1;
          }
          
        }
        
      }
      if (element['DateofWatch'] != null){
        if (element['DateofWatch'] in dateDict){
          dateDict[element['DateofWatch']] += 1;
        }
        
      }
      if (Math.round(element['WatchLength']) > 0){
        var value = Math.round(element['WatchLength'])
        if (value < 60){
          WatchLen['<1'] +=1
        }else if(value > 60 && value <= 300){
          WatchLen['1-5'] +=1
        }else if(value > 300 && value <= 600){
          WatchLen['5-10'] +=1
        }else if(value > 600 && value <= 1200){
          WatchLen['10-20'] +=1
        }else if(value > 1200 && value <= 1800){
          WatchLen['20-30'] +=1
        }else if(value > 1800 && value <= 2400){
          WatchLen['30-40'] +=1
        }else if(value > 2400 && value <= 3000){
          WatchLen['40-50'] +=1
        }else if(value > 3000){
          WatchLen['>1 hour'] +=1
        }
      }


    });


    this.state.dataLst.forEach(function (item) {
      if (item['Timestamp'] != null){
        CountConcentrateDict[(Math.round(item['Timestamp']/30)*30).toString()] += 1
        SumConcentrateDict[Math.round((Math.round(item['Timestamp']/30)*30).toString()).toString()] = SumConcentrateDict[(Math.round(item['Timestamp']/30)*30).toString()] + item['ConcentrationLvl'];
        ConcentrationDict[Math.round((Math.round(item['Timestamp']/30)*30).toString()).toString()] = SumConcentrateDict[(Math.round(item['Timestamp']/30)*30).toString()] / CountConcentrateDict[(Math.round(item['Timestamp']/30)*30).toString()];

        EmotionsOverTime[Math.round((Math.round(item['Timestamp']/30)*30).toString()).toString()][item['Emotions']] += 1;
         
      } 
    });
    const colours = ['#8884d8','#83a6ed','#8dd1e1','#82ca9d','#a4de6c','#d0ed57','#ffc658','#FF625D']
    Object.keys(emotionsdict).forEach(function (key) {
      
        emotionsList.push({ name: key, count: emotionsdict[key],totalemotions:totalEmotionsRecords,fill: colours[0] })
        colours.shift()
      
    });

    Object.keys(WatchLen).forEach(function (key) {
      if (!key.includes("hour")){
        WatchLenList.push({ name: key + " min", Students: WatchLen[key] })
      }else{
        WatchLenList.push({ name: key, Students: WatchLen[key] })
      }
      
    });

    Object.keys(TimeOfDayWatchDict).forEach(function (key) {
      if (key.includes("a")){
        TimeOfDayWatchList.push({ name: key.replace("a","am"), Watches: TimeOfDayWatchDict[key] })
      }else{
        TimeOfDayWatchList.push({ name: key.replace("p","pm"), Watches: TimeOfDayWatchDict[key] })
      }
      
    });

    var datewatchLst = []
    Object.keys(dateDict).forEach(function (key) {
      datewatchLst.push({ name: key, Views: dateDict[key] })
    });

    var concentrateavgLst = []
    Object.keys(ConcentrationDict).forEach(function (key) {
      concentrateavgLst.push({ time: key + " secs", Concentration: ConcentrationDict[key] })
    });
    var ConfusedList = [];
    Object.keys(ConfusedOverTime).forEach(function (key) {
      ConfusedList.push({ Video_time: key + " secs", Confused_Students: ConfusedOverTime[key] })
    });

    var EmotionsOverTimeList = [];
    Object.keys(EmotionsOverTime).forEach(function (key) {
      EmotionsOverTimeList.push({ Video_time: key + " secs", 
      HAPPY: EmotionsOverTime[key]["HAPPY"],
      SAD: EmotionsOverTime[key]["SAD"],
      ANGRY: EmotionsOverTime[key]["ANGRY"],
      CONFUSED: EmotionsOverTime[key]["CONFUSED"],
      DISGUSTED: EmotionsOverTime[key]["DISGUSTED"],
      SURPRISED: EmotionsOverTime[key]["SURPRISED"],
      CALM: EmotionsOverTime[key]["CALM"],
      UNKNOWN: EmotionsOverTime[key]["UNKNOWN"],
      FEAR: EmotionsOverTime[key]["FEAR"]})
    });

    var MondayList = [];
    var TuesdayList = [];
    var WednesdayList = [];
    var ThursdayList = [];
    var FridayList = [];
    var SaturdayList = [];
    var SundayList = [];

    Object.keys(AlldayTimes["Monday"]).forEach(function (key) {
      MondayList.push({ hour: key, index: 1, value: AlldayTimes["Monday"][key] })
      TuesdayList.push({ hour: key, index: 1, value: AlldayTimes["Tuesday"][key] })
      WednesdayList.push({ hour: key, index: 1, value: AlldayTimes["Wednesday"][key] })
      ThursdayList.push({ hour: key, index: 1, value: AlldayTimes["Thursday"][key] })
      FridayList.push({ hour: key, index: 1, value: AlldayTimes["Friday"][key] })
      SaturdayList.push({ hour: key, index: 1, value: AlldayTimes["Saturday"][key] })
      SundayList.push({ hour: key, index: 1, value: AlldayTimes["Sunday"][key] })
    });
    averageVideoWatchLength = new Date(decimalTimeString * 1000).toISOString().substr(11, 8);

    // Map all comments into a list item
    const renderComments = (card, index) => {
      return (
        <ListGroup.Item>
          {card}
        </ListGroup.Item>
    )
    }

    const renderTooltip = (props: any) => {
      const { active, payload } = props;
    
      if (active && payload && payload.length) {
        const data = payload[0] && payload[0].payload;
    
        return (
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #999",
              margin: 0,
              padding: 10
            }}
          >
            <p>{data.hour}</p>
            <p>
              <span>value: </span>
              {data.value}
            </p>
          </div>
        );
      }
    
      return null;
    };
    
    const parseDomain = () => [
      0,
      Math.max(
        Math.max.apply(
          null,
          FridayList.map((entry) => entry.value),
        ),

      ),
    ];

    const style = {
      top: '50%',
      right: 0,
      transform: 'translate(0, -50%)',
      lineHeight: '24px',
    };

    const domain = parseDomain();
    const range = [30, 225];

  // Render loading screen
if (this.state.loading === true){
  return (
      <div name='header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
          <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
        />
             Loading Data Report...
          </Button> 
      </div>
  );
}else{

    return (
      <div width="100%">

        <div name='header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
          <h1>{this.state.videoTitle}</h1>
          
        </div>
        <Row>
        <Col><Image src={SideOne} width="100%" height="100%" alt="decorative image" ></Image></Col>

        <Col xs={10}>        
        <ProgressBar variant="info" now={(studentsWatchedVideo/totalEnrolledStudents)*100} label={`${(studentsWatchedVideo/totalEnrolledStudents)*100}%`}/>
        Students who watched: {studentsWatchedVideo} / {totalEnrolledStudents}
        <div>
        <Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Col>
            <h3>{this.state.videoTitle}</h3>
             <ReactPlayer
                ref={this.playerRef}
                controls = {true}
                url = {`https://lecturevideos132409-intendinew.s3-eu-west-1.amazonaws.com/public/videos/${this.state.videoID + '.mp4'}`}
                onReady={this.getvideoLength}
                height={350}
            />
            </Col>

            <Col>
            <h3>Comments & Questions</h3>
            <Container className="scrollable-div">
            <ListGroup>
              {FeedbackComments.map(renderComments)}
            </ListGroup>
            </Container>
            </Col>
        </Row>
        
        <Row>
            <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">Video Rating</Typography>
            <Rating name="read-only" value={VideoRating} precision={0.25} readOnly /><p>{(VideoRating)} / 5</p>
            </Box>
            <p className="brand-VIDEOTEXT" style={{paddingLeft: '18%'}}> Total Views: {totalVideoViews} | Average Watch Time: {averageVideoWatchLength}</p>
        </Row>
      </div>   
       
      <div>
        <h2 style={{textDecorationLine:'underline'}}>Statistics</h2>
        <Row>
        
        <h3>General Emotions</h3>
        
        <ResponsiveContainer width="100%" height={400}>

        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" barSize={50} data={emotionsList}>
          <RadialBar
            minAngle={10}
            label={{ position: 'insideStart', fill: '#000000' }}
            background
            clockWise
            dataKey="count"
          />
          <Legend iconSize={20} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
        </RadialBarChart>
        
      </ResponsiveContainer>
        </Row>
       <Row>
       
        <h3>Views by Day/Time</h3>
        <ResponsiveContainer width="100%" height={60}>
        <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Monday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={MondayList} fill="#8884d8" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Tuesday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={TuesdayList} fill="#83a6ed" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Wednesday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={WednesdayList} fill="#8dd1e1" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Thursday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={ThursdayList} fill="#82ca9d" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Friday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={FridayList} fill="#a4de6c" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Saturday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={SaturdayList} fill="#d0ed57" />
          </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              name="hour"
              interval={0}
              tick={{ fontSize: 10 }}
              tickLine={{ transform: 'translate(0, -6)' }}
            />
            <YAxis
              type="number"
              dataKey="index"
              
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Sunday', position: 'insideRight' }}
            />
            <ZAxis type="number" dataKey="value" domain={domain} range={range} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
            <Scatter data={SundayList} fill="#ffc658" />
          </ScatterChart>
          </ResponsiveContainer>
       </Row>
        
        <Row>        
        <Col>
        <h3>Watch Sessions by Length</h3>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={1000}
          height={300}
          data={WatchLenList}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Students" stroke="#0c62ab" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </Col>
        
        </Row>
        <Row>
        <h3>Watch Sessions by Time of Day</h3>
        <ResponsiveContainer width="100%" height={400}>
        
          <AreaChart
          width={1000}
          height={300}
          data={TimeOfDayWatchList}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Watches" stroke="#0c62ab" fill="#0c62ab" />
        </AreaChart>
        </ResponsiveContainer>
        
      
        </Row>
        <Row>
        <h3>Views Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={400}>

          <LineChart
          width={1000}
          height={300}
          data={datewatchLst}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Views" stroke="#0c62ab" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </Row>

        <Row>
        <h3>Concentration throughout Video</h3>
        <ResponsiveContainer width="100%" height={400}>
        
          <AreaChart
          width={1000}
          height={300}
          data={concentrateavgLst}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Concentration" stroke="#0c62ab" fill="#0c62ab" />
        </AreaChart>
        </ResponsiveContainer> 
      
        </Row>
        <Row>
        <h3>Confusion throughout Video</h3>
        <ResponsiveContainer width="100%" height={400}>
        
          <AreaChart
          width={1000}
          height={300}
          data={ConfusedList}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="Video_time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Confused_Students" stroke="#0c62ab" fill="#0c62ab" />
        </AreaChart>
        </ResponsiveContainer> 
      
        </Row>
        <Row>
          
        <Col>
        <h3>Emotions Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={1000}
          height={300}
          data={EmotionsOverTimeList}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Video_time"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="HAPPY" stroke="#76EE00" activeDot={{ r: 10}} />
          <Line type="monotone" dataKey="SAD" stroke="BLUE" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="ANGRY" stroke="RED" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="CONFUSED" stroke="PURPLE" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="DISGUSTED" stroke="ORANGE" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="SURPRISED" stroke="#FDE541" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="CALM" stroke="#45b6fe" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="UNKNOWN" stroke="#808080" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </Col>
        
        </Row>
        </div> 
        <div name='header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
        <Button variant="danger" onClick={this.handleShow.bind(this)}>Delete Video</Button>
          
        </div>
        
        </Col>

        <Col><Image src={SideTwo} width="100%" height="100%" style={{padding: '0'}} alt="decorative image" ></Image></Col>
        <Modal
        show={this.state.show}
        onHide={this.handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
        <Modal.Title>Delete Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>   
     
        <h3>Are you sure you want to delete this video? All data will be lost.</h3>

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
        </Row>
      </div>
    );
        }
  }
}

export default DataReport;