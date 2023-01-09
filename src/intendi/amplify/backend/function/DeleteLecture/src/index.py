import json
import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    VideoID = json.loads(eventBody)['VideoID']

    dynamodb = boto3.resource('dynamodb')

    # Delete video from VideoDetails
    video_table = dynamodb.Table('VideoDetails-intendinew')
    videodetailsdelete(video_table,VideoID)
    
    # Delete video details from VideoStudentWatchDetails
    watch_details_table = dynamodb.Table('VideoStudentWatchDetails-intendinew')
    videowatchdetailsdelete(watch_details_table,VideoID)

    # Delete video details from VideoAnalysisData
    analysis_data_table = dynamodb.Table('VideoAnalysisData-intendinew')
    videoanalysisdelete(analysis_data_table,VideoID)
    
    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
        'body': json.dumps('Deleted video')
    }

def videodetailsdelete(video_table,VideoID):
  video_table.delete_item(Key={'VideoID': VideoID})
  return "Succesfully deleted from VideoDetails"

def videowatchdetailsdelete(watch_details_table,VideoID):
  resp = watch_details_table.query(IndexName="VideoIDindex", KeyConditionExpression=Key('VidID').eq(VideoID))
  for item in resp['Items']:
    watch_details_table.delete_item(Key={'UID': item['UID']})
  return "Succesfully deleted from VideoStudentWatchDetails"

def videoanalysisdelete(analysis_data_table,VideoID):
  resp2 = analysis_data_table.query(IndexName="VideoIDIndex", KeyConditionExpression=Key('VideoID').eq(VideoID))
  for item2 in resp2['Items']:
    analysis_data_table.delete_item(Key={'ID': item2['ID']})
  return "Succesfully deleted from VideoAnalysisData"
