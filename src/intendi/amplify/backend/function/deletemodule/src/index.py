import json
import boto3
from boto3.dynamodb.conditions import Key,Attr

def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    subID = json.loads(eventBody)['subID']
    moduleCde = json.loads(eventBody)['moduleCde']

    dynamodb = boto3.resource('dynamodb')

    # Delete module from module table
    module_table = dynamodb.Table('ModuleJoinCode-intendinew')
    modtabledelete(module_table,moduleCde,subID)

    # Delete video details from userdetails_module_table
    userdetails_module_table = dynamodb.Table('UserDetails-intendinew')
    userdetailsmoduledelete(userdetails_module_table,moduleCde)

    # Delete video details from VideoDetailsa
    videodetails_table = dynamodb.Table('VideoDetails-intendinew')
    videodetailsdelete(videodetails_table,moduleCde)
    
    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
        'body': json.dumps('Deleted Module')
    }

def modtabledelete(module_table,modulecde,subid):
    Modules = module_table.query(
        KeyConditionExpression=Key('ModuleCde').eq(modulecde)
    )
    resp = Modules['Items']
    moduleowner = resp[0]['Owner']
    if (subid == moduleowner):
        module_table.delete_item(Key={'ModuleCde': modulecde})
        return "Succesfully deleted from module table"
    print("Succesfully deleted from module table")

def userdetailsmoduledelete(userdetails_module_table,modulecde):
    fe = Attr('ModuleLst').contains(modulecde)
    response = userdetails_module_table.scan(
        FilterExpression=fe        
    )

    for item in response['Items']:
        SubID = item['SubID']
        ModuleLst = item['ModuleLst']
        ModuleLstBack = item['ModandBack']


        ModuleLst.remove(modulecde.upper())
        newmodlstback = [x for x in ModuleLstBack if (modulecde + '~~~') not in x]
        
        resp2 = userdetails_module_table.update_item(
                Key={
                    'SubID': SubID
                },
                UpdateExpression="set ModuleLst=:l",
                ExpressionAttributeValues={
                    ':l': ModuleLst
                },
                ReturnValues="UPDATED_NEW"
            )
        resp3 = userdetails_module_table.update_item(
                Key={
                    'SubID': SubID
                },
                UpdateExpression="set ModandBack=:l",
                ExpressionAttributeValues={
                    ':l': newmodlstback
                },
                ReturnValues="UPDATED_NEW"
            )
    return "Module deleted from all users"

def videodetailsdelete(videodetails_table,moduleCde):
    resp = videodetails_table.query(IndexName="ModuleCde-VideoID", KeyConditionExpression=Key('ModuleCde').eq(moduleCde))
    for item2 in resp['Items']:
        videodetails_table.delete_item(Key={'VideoID': item2['VideoID']})
    return "Succesfully deleted from VideoDetails"


