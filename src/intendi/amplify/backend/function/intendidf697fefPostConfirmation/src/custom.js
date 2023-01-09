var AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "UserDetails-intendinew";

exports.handler = (event, context, callback) => {
  console.log(event);
  var sub = event.request.userAttributes.sub;
  var email = event.request.userAttributes.email;

  var paramsCheck = {
    TableName : "UserDetails-intendinew",
    KeyConditionExpression: "#Sub = :SubID",
    ExpressionAttributeNames:{
        "#Sub": "SubID"
    },
    ExpressionAttributeValues: {
        ":SubID": sub
    }
};

docClient.query(paramsCheck, function(err, data) {
  if (err) {
      console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
      if (data.Items.length < 1){
        var params = {
          TableName: table,
          Item: {
            'SubID': sub,
            'email': email,
            'ModuleLst': [],
            'ModandBack':[]
          },
        };
        const dynamoPromise = docClient.put(params).promise();
        dynamoPromise
          .then((data) => {
            console.log("PutItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, event);
          })
          .catch((err) => {
            console.log(
              "Unable to PUT item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
      
            callback(err, null);
          });
      }else{
        console.log("User resetting password")
      }
  }
});

 
};