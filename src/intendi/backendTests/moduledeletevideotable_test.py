import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.deletemodule.src.index import videodetailsdelete



@mock_dynamodb2
def test_deletevideo():
    # set up DB
    VideoDetails = 'VideoDetails-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=VideoDetails,
        KeySchema=[{'AttributeName': 'VideoID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'VideoID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )



    VideoDetailsTable = dynamodb.Table(VideoDetails)
    VideoDetailsTable.update(
        AttributeDefinitions=[{"AttributeName": "ModuleCde", "AttributeType": "S"}],
        GlobalSecondaryIndexUpdates=[
            {
                "Create": {
                    "IndexName": "ModuleCde-VideoID",
                    "KeySchema": [{"AttributeName": "ModuleCde", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 5,
                        "WriteCapacityUnits": 5,
                    },
                }
            }
        ],
    )

    VideoDetailsTable.put_item(
            Item={
                'VideoID': '998877',
                'ModuleCde': 'CATEST'
            })
    VideoDetailsTable.put_item(
            Item={
                'VideoID': '887766',
                'ModuleCde': 'CATEST'
            })
    VideoDetailsTable.put_item(
            Item={
                'VideoID': '776655',
                'ModuleCde': 'CATEST2'
            })





    response3 = videodetailsdelete(VideoDetailsTable,'CATEST')

    assert response3 == "Succesfully deleted from VideoDetails"
    assert VideoDetailsTable.item_count == 1


    


