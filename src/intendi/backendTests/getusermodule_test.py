import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.GetUserModules.src.index import getUserModules



@mock_dynamodb2
def test_getusermodules():
    # set up DB
    table_name = 'UserDetails-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{'AttributeName': 'SubID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'SubID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

    UserTable = dynamodb.Table(table_name)
    UserTable.put_item(
            Item={
                'SubID': 'abc123',
                'email': 'test.addModule@gmail.com',
                'ModandBack':["abc123-backgroundoption3"],
                'ModuleLst':["abc123"]
            })



    getModuleUser_response = getUserModules(UserTable, "abc123")

    assert getModuleUser_response == ["abc123-backgroundoption3"]