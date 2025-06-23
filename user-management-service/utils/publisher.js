const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue('user.events');
}

async function publishUserEvent(eventType, userData) {
    if (!channel) await connectRabbitMQ();

    const event = {
        type: eventType,
        payload: userData
    };

    channel.sendToQueue('user.events', Buffer.from(JSON.stringify(event)), {
        persistent: true
    });

    console.log(`📤 Published event: ${eventType}`);
}

module.exports = {
    publishUserEvent
};
