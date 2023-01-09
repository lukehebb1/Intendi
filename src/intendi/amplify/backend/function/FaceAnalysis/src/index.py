import json
import boto3
import base64
from decimal import Decimal
def handler(event, context):
  eventBody = json.loads(json.dumps(event))['body']
  imageBase64 = json.loads(eventBody)['Image']
  Uniqueid = json.loads(eventBody)['id']
  VideoID = json.loads(eventBody)['VideoID']
  ImageTime = json.loads(eventBody)['ImageTime']
  UserOnTab = json.loads(eventBody)['UserOnTab']
  VideoMute = json.loads(eventBody)['VideoMute']

  # Strip base64 string
  stripped_base64 = imageBase64.replace("data:image/png;base64,", "")

  # Decode stripped base64
  decode_image = base64.b64decode(stripped_base64)
  file_path = 'Screenshots/' + str(Uniqueid) + '.png'

  # Use boto3 resource instead of client
  s3 = boto3.resource('s3')
  try:
    # Create S3 object
    obj = s3.Object('lecturevideos132409-intendinew', file_path)
    # Upload to S3
    obj.put(Body=decode_image)
  except Exception as e:
    raise IOError(e)

  client=boto3.client('rekognition')
  dynamodb = boto3.client('dynamodb')
  ConcentrationLvl = 100.0
  try:
    response = client.detect_faces(Image={'S3Object':{'Bucket':'lecturevideos132409-intendinew','Name':file_path}},Attributes=['ALL'])
    EyesOpenBool = response['FaceDetails'][0]['EyesOpen']['Value']
    Emotion = response['FaceDetails'][0]['Emotions'][0]['Type']
    EyeLeftDict = response['FaceDetails'][0]['Landmarks'][0]
    EyeLeft = str(EyeLeftDict['X']) + ',' + str(EyeLeftDict['Y'])
    EyeRightDict = response['FaceDetails'][0]['Landmarks'][1]
    EyeRight = str(EyeRightDict['X']) + ',' + str(EyeRightDict['Y'])
    Roll = response['FaceDetails'][0]['Pose']['Roll']
    Yaw = response['FaceDetails'][0]['Pose']['Yaw']
    Pitch = response['FaceDetails'][0]['Pose']['Pitch']

    # Concentration algorithm
    if UserOnTab == False or UserOnTab == "false":
      ConcentrationLvl -= 35

    if VideoMute == True or  VideoMute == "true":
      ConcentrationLvl -= 35

    if Yaw > 45.0 or Yaw < -45.0:
      ConcentrationLvl -= 15

    if Pitch > 30.0 or Pitch < -30.0:
      ConcentrationLvl -= 15

    # Put analysis data in analysis table
    dynamodb.put_item(TableName='VideoAnalysisData-intendinew', Item={'ID':{'S':Uniqueid}, 'VideoID':{'S':VideoID}, 'Timestamp':{'S':str(ImageTime)}, 
                      'EyesOpen':{'S':str(EyesOpenBool)}, 'Emotions':{'S':Emotion}, 'EyeLeft':{'S':EyeLeft}, 'EyeRight':{'S':EyeRight}, 
                      'Roll':{'S':str(Roll)}, 'Yaw':{'S':str(Yaw)}, 'Pitch':{'S':str(Pitch)}, 'UserOnTab':{'BOOL': UserOnTab},'VideoMuted':{'BOOL': VideoMute},'ConcentrationLvl':{'N':str(ConcentrationLvl)}})

  except Exception as e:
    raise IOError(e)

  # Delete image from S3 bucket
  try:
    s3.Object('lecturevideos132409-intendinew', file_path).delete()
  except Exception as e:
    raise IOError(e)

  return {
    'message': 'Hello from your new Amplify Python lambda!'
  }