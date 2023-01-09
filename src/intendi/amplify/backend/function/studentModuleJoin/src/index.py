import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal


def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    SubID = json.loads(eventBody)['SubID']
    ModuleCde = json.loads(eventBody)['ModuleCde']
    ModulePass = json.loads(eventBody)['ModulePass']
    StudentEmail = json.loads(eventBody)['Email']

    dynamodb = boto3.resource('dynamodb')
    JoinResponse = ""
    try:
      user_details_table = dynamodb.Table('UserDetails-intendinew')
      module_table = dynamodb.Table('ModuleJoinCode-intendinew')
      JoinResponse = studentjoin(user_details_table,module_table,SubID ,ModuleCde,ModulePass,StudentEmail)

    except Exception as e:
      raise IOError(e)

    return {
      'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(JoinResponse)
    }


def studentjoin(user_details_table,module_table,SubID ,ModuleCde,ModulePass,StudentEmail):
      data = module_table.query(
        KeyConditionExpression=Key('ModuleCde').eq(ModuleCde.upper()))
      resp = data['Items']
      ModulePasscode = resp[0]['ModulePass']
      ModuleBackground = resp[0]['Background']
      ModuleStudents = resp[0]['EnrolledStudents']
      #  Check Module password
      #  If correct add to student module list
      if ModulePass == ModulePasscode:
        data = user_details_table.query(
          KeyConditionExpression=Key('SubID').eq(SubID))
        resp = data['Items']
        ModuleLst = resp[0]['ModuleLst']
        ModuleLstBack = resp[0]['ModandBack']
        #  Check if student is already enrolled in that module
        if ModuleCde.upper() in ModuleLst:
          return "You are already enrolled in this module."

        else:
          ModuleLst.append(ModuleCde.upper())
          ModuleLstBack.append(ModuleCde.upper() + "~~~" + ModuleBackground)
          resp2 = user_details_table.update_item(
            Key={
              'SubID': SubID
            },
            UpdateExpression="set ModuleLst=:l",
            ExpressionAttributeValues={
              ':l': ModuleLst
            },
            ReturnValues="UPDATED_NEW"
            )
          resp2 = user_details_table.update_item(
            Key={
                'SubID': SubID
            },
            UpdateExpression="set ModandBack=:l",
            ExpressionAttributeValues={
                ':l': ModuleLstBack
            },
            ReturnValues="UPDATED_NEW"
            )
          resp2 = module_table.update_item(
            Key={
                'ModuleCde': ModuleCde.upper()
            },
            UpdateExpression="set NumOfStudents = NumOfStudents + :val",
            ExpressionAttributeValues={
                ':val': Decimal(1)
            },
            ReturnValues="UPDATED_NEW"
            )

          ModuleStudents.append(StudentEmail)
          addStudentEmail = module_table.update_item(
            Key={
                'ModuleCde': ModuleCde.upper()
            },
            UpdateExpression="set EnrolledStudents=:l",
            ExpressionAttributeValues={
                ':l': ModuleStudents
            },
            ReturnValues="UPDATED_NEW"
            )
          return "Successfully Joined Module"

      else:
        return "Unable to Join Module, Please check module code and password and try again."