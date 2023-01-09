import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.ratingSubmit.src.index import feedbacksubmit



@mock_dynamodb2
def test_uploadrating():
    # set up DB
    table_name = 'VideoDetails-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{'AttributeName': 'VideoID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'VideoID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

    video_details_table = dynamodb.Table(table_name)
    video_details_table.put_item(
            Item={
                'VideoID': 'Video1234',
                'AverageRating': 0,
                'FeedbackComments':[],
                'TotalVotes':0
            })



    getsubmitratingresponse = feedbacksubmit(video_details_table, "Video1234",3.5,"Great Video")

    response = video_details_table.scan()

    assert getsubmitratingresponse == 'Successfully submitted Video Rating'
    assert response['Items'][0]['AverageRating'] == 3.5
    assert response['Items'][0]['TotalVotes'] == 1
    assert response['Items'][0]['FeedbackComments'] == ['Great Video']

    getsubmitratingresponse = feedbacksubmit(video_details_table, "Video1234",1,"bad Video")

    response = video_details_table.scan()

    assert getsubmitratingresponse == 'Successfully submitted Video Rating'
    assert response['Items'][0]['AverageRating'] == 2.25
    assert response['Items'][0]['TotalVotes'] == 2
    assert response['Items'][0]['FeedbackComments'] == ['Great Video','bad Video']