import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

def handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    VideoID = json.loads(eventBody)['VideoID']
    ModuleCde = json.loads(eventBody)['ModuleCde']
    Week = json.loads(eventBody)['Week']
    Title = json.loads(eventBody)['Title']
    UploaderID = json.loads(eventBody)['UploaderID']
    UploaderEmail = json.loads(eventBody)['UploaderEmail']
    Description = json.loads(eventBody)['Description']

    # Add video details to database
    dynamodb = boto3.resource('dynamodb')
    videodetails_table = dynamodb.Table('VideoDetails-intendinew')
    uploadVideoDetails(videodetails_table,VideoID,ModuleCde,Week,Title,Description,UploaderID,UploaderEmail)

    # Get list of enrolled students
    module_table = dynamodb.Table('ModuleJoinCode-intendinew')
    students_email_query = module_table.query(KeyConditionExpression=Key('ModuleCde').eq(ModuleCde))
    students_emails = students_email_query['Items'][0]['EnrolledStudents']

    # Send email
    SENDER = "Intendi App <intendiapp@gmail.com>"

    AWS_REGION = "eu-west-1"

    # The subject line for the email.
    SUBJECT = "New Video Uploaded"

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = (f'Hello student!\n\nA new video called {Title} has been uploaded to your module {ModuleCde} in {Week}. Log into your account to watch it!')

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses',region_name=AWS_REGION)

    # Try to send the email.
    for student_email in students_emails:
        try:
            #Provide the contents of the email.
            response = client.send_email(
                Destination={
                    'ToAddresses': [
                        student_email,
                    ],
                },
                Message={
                    'Body': {
                        'Text': {
                            'Charset': CHARSET,
                            'Data': BODY_TEXT,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': SUBJECT,
                    },
                },
                Source=SENDER,
            )
        # Display an error if something goes wrong.	
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])
        
    return {
        'statusCode': 200,
        'body': json.dumps('Uploaded')
    }

def uploadVideoDetails(videodetails_table, VideoID,ModuleCde,Week,Title,Description,UploaderID,UploaderEmail):
    try:
        videodetails_table.put_item(Item={'VideoID':VideoID,'ModuleCde':ModuleCde,'Week':Week,'Title':Title,"VideoDescription":Description,'UploaderID':UploaderID,'UploaderEmail':UploaderEmail,'FeedbackComments':[],'StudentsWatched':[],'NumStudentsWatched':0,'TotalViews':0,'AverageWatchTime':0,'TotalVotes':0,'AverageRating':0})
        return 'Successfully Uploaded Video Details'
    except Exception as e:
        raise IOError(e)
