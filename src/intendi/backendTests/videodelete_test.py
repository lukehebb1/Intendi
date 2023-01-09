import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.DeleteLecture.src.index import videodetailsdelete
from amplify.backend.function.DeleteLecture.src.index import videowatchdetailsdelete
from amplify.backend.function.DeleteLecture.src.index import videoanalysisdelete



@mock_dynamodb2
def test_deletevideo():
    # set up DB
    VideoDetails = 'VideoDetails-intendinew'
    VideoStudentWatchDetails = 'VideoStudentWatchDetails-intendinew'
    VideoAnalysisData = 'VideoAnalysisData-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=VideoDetails,
        KeySchema=[{'AttributeName': 'VideoID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'VideoID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

        # create DB
    dynamodb.create_table(
        TableName=VideoStudentWatchDetails,
        KeySchema=[{'AttributeName': 'UID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'UID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )
    

        # create DB
    dynamodb.create_table(
        TableName=VideoAnalysisData,
        KeySchema=[{'AttributeName': 'ID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'ID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

    VideoDetailsTable = dynamodb.Table(VideoDetails)
    VideoDetailsTable.put_item(
            Item={
                'VideoID': 'videotest1'
            })

    VideoStudentWatchDetailsTable = dynamodb.Table(VideoStudentWatchDetails)
    VideoStudentWatchDetailsTable.update(
        AttributeDefinitions=[{"AttributeName": "VidID", "AttributeType": "S"}],
        GlobalSecondaryIndexUpdates=[
            {
                "Create": {
                    "IndexName": "VideoIDindex",
                    "KeySchema": [{"AttributeName": "VidID", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 5,
                        "WriteCapacityUnits": 5,
                    },
                }
            }
        ],
    )
    VideoStudentWatchDetailsTable.put_item(
            Item={
                'UID': '112233',
                'VidID': 'videotest1'
            })

    VideoAnalysisDataTable = dynamodb.Table(VideoAnalysisData)
    VideoAnalysisDataTable.update(
        AttributeDefinitions=[{"AttributeName": "VideoID", "AttributeType": "S"}],
        GlobalSecondaryIndexUpdates=[
            {
                "Create": {
                    "IndexName": "VideoIDIndex",
                    "KeySchema": [{"AttributeName": "VideoID", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 5,
                        "WriteCapacityUnits": 5,
                    },
                }
            }
        ],
    )
    VideoAnalysisDataTable.put_item(
            Item={
                'ID': '998877',
                'VideoID': 'videotest1'
            })
    VideoAnalysisDataTable.put_item(
            Item={
                'ID': '887766',
                'VideoID': 'videotest1'
            })
    VideoAnalysisDataTable.put_item(
            Item={
                'ID': '776655',
                'VideoID': 'videotest1'
            })
    VideoAnalysisDataTable.put_item(
            Item={
                'ID': '665544',
                'VideoID': 'videotest1'
            })


    response1 = videodetailsdelete(VideoDetailsTable,'videotest1')
    response2 = videowatchdetailsdelete(VideoStudentWatchDetailsTable,'videotest1')
    response3 = videoanalysisdelete(VideoAnalysisDataTable,'videotest1')


    assert response1 == "Succesfully deleted from VideoDetails"
    assert response2 == "Succesfully deleted from VideoStudentWatchDetails"
    assert response3 == "Succesfully deleted from VideoAnalysisData"
    assert VideoDetailsTable.item_count == 0
    assert VideoStudentWatchDetailsTable.item_count == 0
    assert VideoAnalysisDataTable.item_count == 0


