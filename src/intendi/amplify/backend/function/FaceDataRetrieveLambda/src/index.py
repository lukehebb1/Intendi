import json
import boto3
from boto3.dynamodb.conditions import Key
import decimal

def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    VideoID = json.loads(eventBody)['VideoID']

    dynamodb = boto3.resource('dynamodb')
    response = ""

    try:
        Datatable = dynamodb.Table('VideoAnalysisData-intendinew')
        resp = Datatable.query(IndexName="VideoIDIndex",
                               KeyConditionExpression=Key('VideoID').eq(VideoID))
    except Exception as e:
        raise IOError(e)

    try:
        VideoDatatable = dynamodb.Table('VideoDetails-intendinew')
        resp2 = VideoDatatable.query(KeyConditionExpression=Key('VideoID').eq(VideoID))
        studentsWatchedVideo = resp2['Items'][0]['NumStudentsWatched']
        totalVideoViews = resp2['Items'][0]['TotalViews']
        averageVideoWatchLength = resp2['Items'][0]['AverageWatchTime']
        averageVideoRating = resp2['Items'][0]['AverageRating']
        feedbackComments = resp2['Items'][0]['FeedbackComments']
        ModuleCde = resp2['Items'][0]['ModuleCde']
    except Exception as e:
        raise IOError(e)

    try:
        Moduletable = dynamodb.Table('ModuleJoinCode-intendinew')
        numStudentEnrolledQuery = Moduletable.query(KeyConditionExpression=Key('ModuleCde').eq(ModuleCde))
        studentsEnrolled = numStudentEnrolledQuery['Items'][0]['NumOfStudents']

    except Exception as e:
        raise IOError(e)
    
    try:
        VideoWatchSessionDatatable = dynamodb.Table(
            'VideoStudentWatchDetails-intendinew')
        resp3 = VideoWatchSessionDatatable.query(IndexName="VideoIDindex",
                                                 KeyConditionExpression=Key('VidID').eq(VideoID))

    except Exception as e:
        raise IOError(e)

    a_dictionary = {"studentsWatchedVideo": studentsWatchedVideo,"totalVideoViews": totalVideoViews, "averageVideoWatchLength": averageVideoWatchLength,"averageVideoRating":averageVideoRating,"FeedbackComments":feedbackComments,"NumStudentsEnrolled": studentsEnrolled}
    resp['Items'].append(a_dictionary)

    try:
        for item in resp3['Items']:
            resp['Items'].append(item)
        
    except Exception as e:
        raise IOError(e)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(resp['Items'], default=decimal_default)
    }

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError
