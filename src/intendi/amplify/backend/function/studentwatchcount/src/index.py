import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    SubID = json.loads(eventBody)['SubID']
    thisUID = json.loads(eventBody)['thisUID']
    VideoID = json.loads(eventBody)['VideoID']
    ModuleCde = json.loads(eventBody)['ModuleCde']
    Browser = json.loads(eventBody)['Browser']
    WatchLength = json.loads(eventBody)['WatchLength']
    WatchDay = json.loads(eventBody)['WatchDay']
    WatchTime = json.loads(eventBody)['WatchTime']
    WatchDate = json.loads(eventBody)['WatchDate']

    dynamodb = boto3.resource('dynamodb')

    try:
        video_student_watch_table = dynamodb.Table('VideoStudentWatchDetails-intendinew')
        addstudentwatchsession(video_student_watch_table,thisUID,VideoID,ModuleCde,Browser,WatchDay,WatchTime,WatchDate)
    except Exception as e:
        raise IOError(e)

    try:
        # Update student watch count
        video_details_table = dynamodb.Table('VideoDetails-intendinew')
        JoinResponse = updatevideowatchdata(video_details_table,SubID,VideoID)

    except Exception as e:
      raise IOError(e)

    return {
      'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(JoinResponse)
    }

def addstudentwatchsession(video_student_watch_table,thisUID,VideoID,ModuleCde,Browser,WatchDay,WatchTime,WatchDate):
    video_student_watch_table.put_item(Item={'UID':thisUID,'VidID':VideoID,'ModuleCde':ModuleCde,'BrowserUsed':Browser,'WatchLength':0,'WatchDay':WatchDay,'WatchTime':WatchTime,'DateofWatch':WatchDate})
    return "Added watch session"


def updatevideowatchdata(video_details_table,SubID,VideoID):
    data = video_details_table.query(
        KeyConditionExpression=Key('VideoID').eq(VideoID))
    resp = data['Items']
    StudentsWatched = resp[0]['StudentsWatched']
    resp2 = video_details_table.update_item(
            Key={
                'VideoID': VideoID
            },
            UpdateExpression="set TotalViews = TotalViews + :val",
            ExpressionAttributeValues={
                ':val': Decimal(1)
            },
            ReturnValues="UPDATED_NEW"
            )
    if SubID in StudentsWatched:
        return "This Student Already Watched"
    else:
        StudentsWatched.append(SubID)
        resp2 = video_details_table.update_item(
            Key={
              'VideoID': VideoID
            },
            UpdateExpression="set StudentsWatched=:l",
            ExpressionAttributeValues={
              ':l': StudentsWatched
            },
            ReturnValues="UPDATED_NEW"
            )
        resp2 = video_details_table.update_item(
            Key={
                'VideoID': VideoID
            },
            UpdateExpression="set NumStudentsWatched = NumStudentsWatched + :val",
            ExpressionAttributeValues={
                ':val': Decimal(1)
            },
            ReturnValues="UPDATED_NEW"
            )
        return "This Student has now Watched"