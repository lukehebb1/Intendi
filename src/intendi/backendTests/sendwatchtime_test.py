import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.sendwatchtime.src.index import updatewatchdetailstime
from amplify.backend.function.sendwatchtime.src.index import updatevideowatchtime


@mock_dynamodb2
def test_sendwatchtime():
    # set up DB
    watchsession_name = 'VideoStudentWatchDetails-intendinew'

    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=watchsession_name,
        KeySchema=[{'AttributeName': 'UID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'UID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )


    WatchSessionTable = dynamodb.Table(watchsession_name)
    WatchSessionTable.put_item(
            Item={
                'UID': 'session1',
                'WatchLength':0
            })




    addwatchsession_response = updatewatchdetailstime(WatchSessionTable, "5","session1")



    watchsessiontablescan = WatchSessionTable.scan()


    assert addwatchsession_response == "Updated Watch session time"


    assert watchsessiontablescan['Items'][0]['WatchLength'] == 5



@mock_dynamodb2
def test_sendwatchtimetovideo():
    # set up DB
    videodetails_name = 'VideoDetails-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    


    # create DB
    dynamodb.create_table(
        TableName=videodetails_name,
        KeySchema=[{'AttributeName': 'VideoID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'VideoID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )



    VideoTable = dynamodb.Table(videodetails_name)
    VideoTable.put_item(
            Item={
                'VideoID': 'VideoID123',
                'StudentsWatched': ['user123'],
                'TotalViews':1,
                'NumStudentsWatched':1,
                'AverageWatchTime':0
            })





    addvideodetails_response = updatevideowatchtime(VideoTable, "5","VideoID123")



    videodetailstablescan = VideoTable.scan()


    assert addvideodetails_response == "Updated Video Average Watch Time"


    assert videodetailstablescan['Items'][0]['StudentsWatched'] == ["user123"]
    assert videodetailstablescan['Items'][0]['TotalViews'] == 1
    assert videodetailstablescan['Items'][0]['AverageWatchTime'] == 5