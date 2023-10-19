'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});
const { Consumer } = require('sqs-consumer');

const uuid = require('uuid').v4;
const faker = require('faker');
const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:657688290340:pickup.fifo';

const order = {
  orderId: uuid(),
  customer: faker.name.findName(),
  vendorId: 'https://sqs.us-west-2.amazonaws.com/657688290340/206-flowers'
};

const payload = {
  TopicArn: topic,
  Message: JSON.stringify(order),
  MessageGroupId: '5678',
  MessageDeduplicationId:faker.datatype.uuid()
};

setInterval(() => {
  sns.publish(payload).promise()
    .then(data => {
      console.log(data);
    })
    .catch(console.error);
  ;

}, 5000);

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/657688290340/206-flowers',
  handleMessage: async (message) => {
    console.log(message.Body);
  }
});

app.start();