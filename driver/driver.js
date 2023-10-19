'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const uuid = require('uuid').v4;
 
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/657688290340/packages.fifo',
  handleMessage: async (message) => {
    const msg = JSON.parse(message.Body);
    const order = JSON.parse(msg.Message);
    console.log('Picked up: ', order);

    setTimeout(async () => {
      const producer = Producer.create({
        queueUrl: order.vendorId,
        region: 'us-west-2'
      });

      await producer.send({
        id: uuid(),
        body: JSON.stringify(order)
      });

      console.log(`${order.orderId} delivered`);
    }, 5000)
  },
  pollingWaitTimeMs: 5000
});

app.start();