import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.AddmoduleToUser.src.index import updateLectureList



@mock_dynamodb2
def test_createmodule():
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
                'ModandBack':[],
                'ModuleLst':[]
            })



    addedModuletoUser_response = updateLectureList(UserTable, "abc123","CAtest","123","background1")

    response = UserTable.scan()

    assert addedModuletoUser_response == 'Module Added to Lecturer'
    assert response['Items'][0]['ModuleLst'] == ["CATEST"]