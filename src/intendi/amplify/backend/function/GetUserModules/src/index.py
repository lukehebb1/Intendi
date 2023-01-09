import json
import boto3
from boto3.dynamodb.conditions import Key


def handler(event, context):

    result = json.loads(event['body'])
    sub = result['sub']
    dynamodb = boto3.resource('dynamodb')

    # Get user modules
    table = dynamodb.Table('UserDetails-intendinew')
    ModuleCodes = getUserModules(table,sub)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(ModuleCodes)
    }

def getUserModules(usertable,subid):
    userModules = usertable.query(
        KeyConditionExpression=Key('SubID').eq(subid)
    )
    resp = userModules['Items']
    ModuleCodes = resp[0]['ModandBack']
    return ModuleCodes