import Amplify from '@aws-amplify/core';
import Storage from '@aws-amplify/storage';

export function configureAmplify() {
  Amplify.configure(
  {
  Storage: { 
     bucket: process.env.REACT_APP_Bucket_name,
     region: process.env.REACT_APP_region,
     identityPoolId: process.env.REACT_APP_identityPoolId
    }
  }
 );
} 

export function SetS3Config(bucket, level){
    Storage.configure({ 
           bucket: bucket,
           level: level,
           region: 'eu-west-1',  
           identityPoolId: process.env.REACT_APP_identityPoolId 
        });
 }