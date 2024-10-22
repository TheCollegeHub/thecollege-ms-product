import { Kafka } from 'kafkajs';
import { updateProductStock } from '../../service/stock-service';

const kafka = new Kafka({
  clientId: 'thecollege-app',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();
const topic = 'update-stock';

const createTopicIfNotExists = async (topic) => {
  await admin.connect();
  const topics = await admin.listTopics();
  
  if (!topics.includes(topic)) {
    await admin.createTopics({
      topics: [{ topic, numPartitions: 1 }],
    });
    console.log(`Topic "${topic}" created with sucess.`);
  } else {
    console.log(`Topic "${topic}" already exist.`);
  }

  await admin.disconnect();
};

const runConsumer = async () => {
  await createTopicIfNotExists(topic);

  const consumer = kafka.consumer({ groupId: 'thecollege-group' });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Message received:', message.value.toString());

      try {
        const { productId, quantity } = JSON.parse(message.value.toString());
        await updateProductStock(productId, quantity);
        console.log(`Stock updated for product ${productId} removing ${quantity}`);
      } catch (error) {
        console.error('Error to process kafka message:', error);
      }
    },
  });
};

runConsumer().catch(console.error);
