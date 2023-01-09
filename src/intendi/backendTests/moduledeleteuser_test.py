import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.deletemodule.src.index import userdetailsmoduledelete



@mock_dynamodb2
def test_deletevideo():
    # set up DB
    UserDetails = 'UserDetails-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')

    # create DB
    dynamodb.create_table(
        TableName=UserDetails,
        KeySchema=[{'AttributeName': 'SubID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'SubID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )
   


    UserTable = dynamodb.Table(UserDetails)
    UserTable.put_item(
            Item={
                'SubID': '123',
                'ModuleLst': ['CATEST','CATEST2','CATEST1'],
                'ModandBack': ['CATEST~~~URLTOIMAGE','CATEST2~~~URLTOIMAGE','CATEST1~~~URLTOIMAGE']
            })
    UserTable.put_item(
            Item={
                'SubID': '321',
                'ModuleLst': ['CATEST','CATEST2'],
                'ModandBack': ['CATEST~~~URLTOIMAGE','CATEST2~~~URLTOIMAGE']
            })
    UserTable.put_item(
            Item={
                'SubID': '222',
                'ModuleLst': [],
                'ModandBack': []
            })


    response2 = userdetailsmoduledelete(UserTable,'CATEST')
    
    userscan = UserTable.scan()

    assert response2 == "Module deleted from all users"

    for item in userscan['Items']:
        if item['SubID'] == '123':
            assert item['ModuleLst'] == ['CATEST2','CATEST1']
            assert item['ModandBack'] == ['CATEST2~~~URLTOIMAGE','CATEST1~~~URLTOIMAGE']
        elif item['SubID'] == '321':
            assert item['ModuleLst'] == ['CATEST2']
            assert item['ModandBack'] ==  ['CATEST2~~~URLTOIMAGE']



    


