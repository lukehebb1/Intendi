"use strict";
// Need to use AWS 
const AWS = require("aws-sdk");
// Creating new S3 instance
const s3 = new AWS.S3({ signatureVersion: "v4" });
// Bucket name we are going to connect
const bucketName = "lecturevideos132409-intendinew";
// Epiration Time of the presignedUrl
const expirationInSeconds = 120;
exports.handler = function (event, context) {
	context.succeed('hello world');
};
