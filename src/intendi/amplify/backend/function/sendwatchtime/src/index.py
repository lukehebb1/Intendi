import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    VideoID = json.loads(eventBody)['VideoID']
    WatchTime = json.loads(eventBody)['WatchTime']
    StudentWatchUID = json.loads(eventBody)['StudentWatchUID']
    dynamodb = boto3.resource('dynamodb')

    try:
        # Update student watch time
        video_student_watch_table = dynamodb.Table('VideoStudentWatchDetails-intendinew')
        updatewatchdetailstime(video_student_watch_table,WatchTime,StudentWatchUID)
       
    except Exception as e:
        raise IOError(e)

    try:
        video_details_table = dynamodb.Table('VideoDetails-intendinew')
        updatevideowatchtime(video_details_table,WatchTime,VideoID)

    except Exception as e:
        raise IOError(e)
        
    return {
      'statusCode': 200,
      'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': "Successfulyl sent video watch time."
  }

def updatewatchdetailstime(video_student_watch_table,WatchTime,StudentWatchUID):
    stringWatchTime = str(WatchTime)
    resp2 = video_student_watch_table.update_item(
            Key={
                'UID': StudentWatchUID
            },
            UpdateExpression="set WatchLength =:val",
            ExpressionAttributeValues={
                ':val': Decimal(stringWatchTime)
            },
            ReturnValues="UPDATED_NEW"
            )
    return "Updated Watch session time"


def updatevideowatchtime(video_details_table,WatchTime,VideoID):
    data = video_details_table.query(
        KeyConditionExpression=Key('VideoID').eq(VideoID))
    resp = data['Items']
    averagewatchtime = resp[0]['AverageWatchTime']
    totalViews = resp[0]['TotalViews']

    newaverage = averagewatchtime + ((Decimal(WatchTime) - averagewatchtime) / totalViews)
        
    resp2 = video_details_table.update_item(
        Key={
                'VideoID': VideoID
        },
        UpdateExpression="set AverageWatchTime =:val",
        ExpressionAttributeValues={
            ':val': newaverage
        },
        ReturnValues="UPDATED_NEW"
        )
    return "Updated Video Average Watch Time"