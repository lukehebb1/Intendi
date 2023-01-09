import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.AddmoduleToUser.src.index import addmodulepassword



@mock_dynamodb2
def test_modulepassword():
    # set up DB
    table_name = 'ModuleJoinCode-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{'AttributeName': 'ModuleCde', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'ModuleCde','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

    ModuleTable = dynamodb.Table(table_name)




    ModuleTable_response = addmodulepassword(ModuleTable, "abc123","CAtest","123","background1")

    response = ModuleTable.scan()

    assert ModuleTable_response == 'Module created'
    assert response['Items'][0]['ModuleCde'] == "CATEST"
    assert response['Items'][0]['ModulePass'] == '123'
    assert response['Items'][0]['Owner'] == 'abc123'