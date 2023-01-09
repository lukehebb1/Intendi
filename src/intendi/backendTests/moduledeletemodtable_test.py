import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.deletemodule.src.index import modtabledelete



@mock_dynamodb2
def test_deletevideo():
    # set up DB
    moduleDetails = 'ModuleJoinCode-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=moduleDetails,
        KeySchema=[{'AttributeName': 'ModuleCde', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'ModuleCde','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )
    


    moduleTable = dynamodb.Table(moduleDetails)
    moduleTable.put_item(
            Item={
                'ModuleCde': 'CATEST',
                'Owner': '123'
            })
    moduleTable.put_item(
            Item={
                'ModuleCde': 'CATEST1',
                'Owner': '123'
            })
    moduleTable.put_item(
            Item={
                'ModuleCde': 'CATEST2',
                'Owner': '123'
            })




    response1 = modtabledelete(moduleTable,'CATEST','123')


    assert response1 == "Succesfully deleted from module table"
    assert moduleTable.item_count == 2



    


