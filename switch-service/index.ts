import { consumer } from "./utils/kafkas";
import { bankServiceAPI } from "./utils/http";
import dotenv from "dotenv";

dotenv.config();

const topic = process.env.TOPIC_NAME!;

const start = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`🟢 Listening to topic: ${topic}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = message.value?.toString();
        if (!payload) return;

        const { senderId, receiverId, amount } = JSON.parse(payload);
        console.log(
          `🔁 Processing transfer from ${senderId} ➡️ ${receiverId}: $${amount}`
        );

        console.log(
          `🔍 Calling bankServiceAPI: /accounts/${receiverId}/balance`
        );
        // Update receiver's balance
        await bankServiceAPI.put(`/api/bank/accounts/${receiverId}/balance`, {
          amount,
        });
          await bankServiceAPI.put(`/api/bank/accounts/${senderId}/balance`, {
          amount: -amount,
        });

        console.log("✅ Balance updated for receiver and sender accounts");
      } catch (err: any) {
        console.error("❌ Failed to process message:", err.message);
      }
    },
  });
};

start();
