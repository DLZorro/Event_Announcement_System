const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const eventData = event.Records[0].dynamodb.NewImage;
  await sns.publish({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: `New Event: ${eventData.title.S}\nDate: ${eventData.date.S}`
  }).promise();
};