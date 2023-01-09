import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.studentwatchcount.src.index import addstudentwatchsession
from amplify.backend.function.studentwatchcount.src.index import updatevideowatchdata


@mock_dynamodb2
def test_updatewatchcount():
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



    addwatchsession_response = addstudentwatchsession(WatchSessionTable, "session1","VideoID123","CATEST","Chrome","Saturday","11:05:29.265","01/01/2021")


    addwatchsession_response2 = addstudentwatchsession(WatchSessionTable, "session2","VideoID123","CATEST","Chrome","Saturday","11:05:29.265","01/01/2021")


    watchsessiontablescan = WatchSessionTable.scan()


    assert addwatchsession_response == "Added watch session"


    assert addwatchsession_response2 == "Added watch session"



    


@mock_dynamodb2
def test_updatewatchcountvideo():
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
                'StudentsWatched': [],
                'TotalViews':0,
                'NumStudentsWatched':0
            })





    addvideodetails_response = updatevideowatchdata(VideoTable, "user123","VideoID123")

    addvideodetails_response2 = updatevideowatchdata(VideoTable, "user123","VideoID123")


    videodetailstablescan = VideoTable.scan()


    assert addvideodetails_response == "This Student has now Watched"


    assert addvideodetails_response2 == "This Student Already Watched"


    
    assert videodetailstablescan['Items'][0]['StudentsWatched'] == ["user123"]
    assert videodetailstablescan['Items'][0]['TotalViews'] == 2
    assert videodetailstablescan['Items'][0]['NumStudentsWatched'] == 1