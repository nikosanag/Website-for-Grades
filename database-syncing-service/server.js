const amqp = require('amqplib');
const { MongoClient } = require('mongodb');

(async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();
    const queue = 'user.events';

    await channel.assertQueue(queue);

    const loginClient = await MongoClient.connect(process.env.LOGIN_DB_URI);
    const loginDb = loginClient.db();
    const loginUsers = loginDb.collection('users');

    channel.consume(queue, async msg => {
        const { type, payload } = JSON.parse(msg.content.toString());

        if (type === 'user.updated' || type === 'user.created') {
            await loginUsers.updateOne(
                { _id: payload.id }, // fixed line
                { $set: payload },
                { upsert: true }
            );
        }

        channel.ack(msg);
    });
})();
