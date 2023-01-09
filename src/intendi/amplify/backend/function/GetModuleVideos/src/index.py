import json
import boto3
from boto3.dynamodb.conditions import Key
import decimal

def handler(event, context):
  eventBody = json.loads(json.dumps(event))['body']
  ModuleCde = json.loads(eventBody)['ModuleCde']

  dynamodb = boto3.resource('dynamodb')
  response = ""
  try:
    # Get overview info
    overview_dict = {}
    # Num of students enrolled
    moduletable = dynamodb.Table('ModuleJoinCode-intendinew')
    students_num_query = moduletable.query(KeyConditionExpression=Key('ModuleCde').eq(ModuleCde))
    students_num = students_num_query['Items'][0]['NumOfStudents']
    overview_dict['NumOfStudents'] = students_num

    # Num of videos uploaded and get videos
    videotable = dynamodb.Table('VideoDetails-intendinew')
    videotable_query = videotable.query(IndexName="ModuleCde-VideoID",KeyConditionExpression=Key('ModuleCde').eq(ModuleCde))
    videos_uploaded = len(videotable_query['Items'])
    overview_dict['NumOfVideos'] = videos_uploaded

    # Total views counter
    total_views = 0
    for views in videotable_query['Items']:
      total_views = total_views + views['TotalViews']

    overview_dict['TotalViews'] = total_views

    # Most/least watched videos
    video_views_dict = {}
    for vid in videotable_query['Items']:
      video_views_dict[vid['Title']] = vid['TotalViews']

    # Sorted list, can now use indexes to get most and least watched vids
    video_list = sorted(video_views_dict.keys(), key=lambda x: video_views_dict[x])
    if len(video_list) < 3:
      overview_dict['LeastWatchedVids'] = 'There must be 3 videos uploaded to see this statistic.'
      overview_dict['MostWatchedVids'] = 'There must be 3 videos uploaded to see this statistic.'
    else:
      overview_dict['LeastWatchedVids'] = video_list[:3]
      overview_dict['MostWatchedVids'] = video_list[:-4:-1]

    videotable_query['Items'].append(overview_dict)

  except Exception as e:
        raise IOError(e)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(videotable_query['Items'], default=decimal_default)
    }

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError


