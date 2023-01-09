import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    VideoID = json.loads(eventBody)['VideoID']
    rating = json.loads(eventBody)['Rating']
    feedbackComments = json.loads(eventBody)['feedbackComments']
    dynamodb = boto3.resource('dynamodb')
    video_details_table = dynamodb.Table('VideoDetails-intendinew')
    
    # Update video details votes, rating and any comments
    feedbacksubmit(video_details_table,VideoID ,rating,feedbackComments)

    return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': "Submitted Rating"
  }

def feedbacksubmit(video_details_table,VideoID ,rating,feedbackComments):
    try:
        data = video_details_table.query(
        KeyConditionExpression=Key('VideoID').eq(VideoID))
        resp = data['Items']
        averageRating = resp[0]['AverageRating']
        totalVotes = resp[0]['TotalVotes']
        FeedbackLst = resp[0]['FeedbackComments']
        totalVotes += 1
        if totalVotes == 0:
            newRating = rating
        else:
            newRating = averageRating + ((Decimal(rating) - averageRating) / totalVotes)

        if feedbackComments != "":
            FeedbackLst.append(feedbackComments)
            AddFeedbackComment =  video_details_table.update_item(
                Key={
                'VideoID': VideoID
                },
                UpdateExpression="set FeedbackComments =:val",
                ExpressionAttributeValues={
                ':val': FeedbackLst
            },
                ReturnValues="UPDATED_NEW"
            )
        
        resp2 = video_details_table.update_item(
            Key={
                'VideoID': VideoID
            },
            UpdateExpression="set AverageRating =:val",
            ExpressionAttributeValues={
                ':val': Decimal(newRating)
            },
            ReturnValues="UPDATED_NEW"
            )

        voteCountUpdate = video_details_table.update_item(
            Key={
                'VideoID': VideoID
            },
            UpdateExpression="set TotalVotes =:val",
            ExpressionAttributeValues={
                ':val': totalVotes
            },
            ReturnValues="UPDATED_NEW"
            )
        return 'Successfully submitted Video Rating'
    except Exception as e:
        raise IOError(e)