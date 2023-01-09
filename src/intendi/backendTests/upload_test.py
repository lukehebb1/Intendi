import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.Uploadvideo.src.index import uploadVideoDetails



@mock_dynamodb2
def test_uploadVideoDB():
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

    VideoTable = dynamodb.Table(table_name)


    addedVideo_response = uploadVideoDetails(VideoTable, "abc123","CA-TESTUPLOAD","Week 1","Upload Test","Testing Upload Lambda","testingID","test.lambda@gmail.com")

    response = VideoTable.scan()

    assert addedVideo_response == 'Successfully Uploaded Video Details'
    assert response['Items'][0]['VideoID'] == "abc123"