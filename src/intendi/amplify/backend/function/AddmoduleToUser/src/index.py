import json
import boto3
from boto3.dynamodb.conditions import Key


def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    SubID = json.loads(eventBody)['SubID']
    ModuleCde = json.loads(eventBody)['ModuleCde']
    ModulePass = json.loads(eventBody)['ModulePass']
    ModuleBackground = json.loads(eventBody)['Background']

    response = ""
    dynamodb = boto3.resource('dynamodb')
    user_details_table = dynamodb.Table('UserDetails-intendinew')
    module_join_code_table = dynamodb.Table('ModuleJoinCode-intendinew')
    data = user_details_table.query(KeyConditionExpression=Key('SubID').eq(SubID))
    resp = data['Items']
    ModuleLst = resp[0]['ModuleLst']
    ModuleLstBack = resp[0]['ModandBack']

    #  Update lecturer's module list in UserDetails table
    if ModuleCde in ModuleLst:
        response = "This module already exists."
    else:
        response = updateLectureList(user_details_table, SubID, ModuleCde, ModulePass, ModuleBackground)
        response = addmodulepassword(module_join_code_table, SubID, ModuleCde, ModulePass, ModuleBackground)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(response)
    }

def updateLectureList(UserTable, SubID, ModuleCde, ModulePass, ModuleBackground):
    data = UserTable.query(
        KeyConditionExpression=Key('SubID').eq(SubID))
    resp = data['Items']
    ModuleLst = resp[0]['ModuleLst']
    ModuleLstBack = resp[0]['ModandBack']


    ModuleLst.append(ModuleCde.upper())
    ModuleLstBack.append(ModuleCde.upper() + "~~~" + ModuleBackground)

    resp2 = UserTable.update_item(
                Key={
                    'SubID': SubID
                },
                UpdateExpression="set ModuleLst=:l",
                ExpressionAttributeValues={
                    ':l': ModuleLst
                },
                ReturnValues="UPDATED_NEW"
            )
    resp3 = UserTable.update_item(
                Key={
                    'SubID': SubID
                },
                UpdateExpression="set ModandBack=:l",
                ExpressionAttributeValues={
                    ':l': ModuleLstBack
                },
                ReturnValues="UPDATED_NEW"
            )
    return "Module Added to Lecturer"

def addmodulepassword(module_join_code_table, SubID, ModuleCde, ModulePass, ModuleBackground):
    #  Add module owner, module code and module password to ModuleJoinCode table
    module_join_code_table.put_item(Item={'Owner': SubID, 'ModuleCde': ModuleCde.upper(), 'ModulePass': ModulePass, "Background": ModuleBackground, "NumOfStudents": 0, "EnrolledStudents": []})

    response = "Module created"
    return response
