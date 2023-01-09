import boto3
import pytest
import sys
sys.path.append('..')
from moto import mock_dynamodb2
from amplify.backend.function.studentModuleJoin.src.index import studentjoin



@mock_dynamodb2
def test_studentmodulejoin():
    # set up DB
    usertable_name = 'UserDetails-intendinew'
    moduletable_name = 'ModuleJoinCode-intendinew'
    dynamodb = boto3.resource('dynamodb', 'eu-west-1')
    
    # create DB
    dynamodb.create_table(
        TableName=usertable_name,
        KeySchema=[{'AttributeName': 'SubID', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'SubID','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )

        # create DB
    dynamodb.create_table(
        TableName=moduletable_name,
        KeySchema=[{'AttributeName': 'ModuleCde', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'ModuleCde','AttributeType': 'S'}],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )


    UserTable = dynamodb.Table(usertable_name)
    UserTable.put_item(
            Item={
                'SubID': 'abc123',
                'email': 'test.addModule@gmail.com',
                'ModandBack':[],
                'ModuleLst':[]
            })

    ModuleTable = dynamodb.Table(moduletable_name)
    ModuleTable.put_item(
            Item={
                'ModuleCde': 'CATEST',
                'Background': 'backgroundone',
                'EnrolledStudents':[],
                'ModulePass':'123',
                'NumOfStudents': 0,
                'Owner':'1111222333'
            })
    ModuleTable.put_item(
            Item={
                'ModuleCde': 'CATEST2',
                'Background': 'backgroundone',
                'EnrolledStudents':[],
                'ModulePass':'122',
                'NumOfStudents': 0,
                'Owner':'1111222333'
            })



    addedModuletoStudent_response = studentjoin(UserTable,ModuleTable, "abc123","CATEST","123","test.addModule@gmail.com")
    addedModuletoStudentError_response = studentjoin(UserTable,ModuleTable, "abc123","CATEST","123","test.addModule@gmail.com")
    addedModuletoStudentWrongPassword_response = studentjoin(UserTable,ModuleTable, "abc123","CATEST2","123","test.addModule@gmail.com")
    

    usertablescan = UserTable.scan()
    moduletablescan = ModuleTable.scan()

    assert addedModuletoStudent_response == "Successfully Joined Module"
    assert addedModuletoStudentError_response == 'You are already enrolled in this module.'
    assert addedModuletoStudentWrongPassword_response == "Unable to Join Module, Please check module code and password and try again."
    assert usertablescan['Items'][0]['ModuleLst'] == ["CATEST"]
    assert moduletablescan['Items'][0]['NumOfStudents'] == 1
    assert moduletablescan['Items'][0]['EnrolledStudents'] == ['test.addModule@gmail.com']