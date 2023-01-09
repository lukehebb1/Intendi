# School of Computing &mdash; Year 4 Project Proposal Form



## SECTION A

|                     |                   |
|---------------------|-------------------|
|Project Title:       | Intendi            |
|Student 1 Name:      | Karl Duignan            |
|Student 1 ID:        | 16105982            |
|Student 2 Name:      | Luke Hebblethwaite            |
|Student 2 ID:        | 17425212            |
|Project Supervisor:  | Michael Scriney            |

## SECTION B


### Introduction

The general idea of our project is to create a simple user interface web app to provide feedback on participants involved in pre-recorded video lectures and create data analysis reports for the lecturer. This will provide useful insight such as participation and concentration levels as well as how people may respond to certain aspects of the lecture being provided by the video.

### Outline

Our proposed project is a facial analysis web app that assesses the concentration level of students while they watch pre-recorded lectures. The idea is that the student logs into the web app selects their chosen module and selects a lecture video to watch. When they begin watching the video, their webcam will activate and begin recording for later facial analysis. We will also analyse the video playback speed, whether the whole video is being watched the full way through, fast-forwarding certain aspects and whether or not the student is inside the correct tab among others. After the student has finished watching the video we will analyse the webcam recording. Our facial analysis algorithm will then read different aspects of the student's face. This will range from different facial landmarks such as head position, eyes, mouth and other aspects. Here we will create a confidence level for different emotions and key concentration indicators such as attention to the screen. After all of this analysis is finished, we will create a report for the lecturer outlining the student's concentration level throughout the video, showing points they lost interest in and points where there was a high level of interest. The lecturer can then log in to their admin account and view any reports based on which module and video recording the select.

### Background

The basis of the idea came from when we were discussing how lecturers nowadays don’t have the ability to tell whether or not students are interacting with the new pre-recorded lectures. For example, if they are paying attention throughout or how easy students found it to stay engaged with these pre-recorded lectures. We then delved into the idea more and realized it can also be hard for lecturers to even know which part of the course interested students.

Our idea originally was to use live analysis on Zoom lectures but we soon discovered it would be near impossible to correctly and efficiently use the raw video data provided by Zoom. We then met with our supervisor, Michael Scriney, who helped us change and mould our idea into the one we have today.

### Achievements

The project will provide lecturers with a report outlining each student's concentration levels during each pre-recorded lecture they watch. The users will be lecturers and students. We also feel the scope of the project is quite big and therefore it could be developed to be used by business companies. This way the company could use the software to gain general feedback/response for past or future presentations.

### Justification

This could be seen as useful particularly to lecturers in the third level. It would be beneficial for them to see how students are reacting to certain aspects of the course/module. This is particularly useful nowadays with COVID-19 and the rise in pre-recorded lectures given to students this year. The lecturers and students will be able to easily access it from the comfort of their own home as it will be made available online.

### Programming language(s)

-   Javascript
-   Java
-   Python


### Programming tools / Tech stack

We plan to create a React web app which we will host on AWS or Firebase. The backend will be developed using Django. This will handle things such as logins and the event listeners needed to analyse video playback factors. We plan to implement the video upload process through React, which will upload the video to an AWS S3 bucket with a unique I.D through a POST request. A Lambda function is then triggered which acquires the video through the unique I.D and will use API calls to AWS Rekognition which will then be stored in a DynamoDB database. We can access this data to analyse it and create a visual representation of it for the lecturer including insights, bar charts and other useful visual representations.

-   Visual Studio
-   AWS S3
-   AWS Lambda
-   AWS DynamoDB
-   AWS Rekognition
-   Django
-   React


### Hardware

-   Webcam

### Learning Challenges

-   React
-   AWS Rekognition
-   S3 Bucket
-   JSON
-   Django
-   DynamoDB

## Breakdown of work



#### Karl Duignan

-   S3 Bucket set up/management
-   Front End (React)
-   Accessibility testing
-   Browser Compatibility testing


#### Luke Hebblethwaite

-  DynamoDB set up/management
-  Back End (Django)
-  Back End testing
-  CI/CD Pipelines

#### Both

-   Face analysis research/algorithm
-   Lambda development
-   Unit Testing
-   Ethics forms




