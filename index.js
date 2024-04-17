const mqtt = require("mqtt");
const io = require("socket.io-client");
const dote = require("dotenv");

dote.config();
const brokerAddress = process.env.MQTT_BROKER_URL;
const topicTemperature = "casa/temperatura";
const topicCurrent = "casa/corriente";
const topicVoltage = "casa/voltaje";
const socket = io(process.env.SOCKET_SERVER_URL, { transports: ["websocket"] });

const sendIncomingData = (data) => {
  socket.emit("IncomingData", data);
};

// Example usage
const onMessage = (topic, message) => {
  sendIncomingData(message.toString());
};

const client = mqtt.connect(brokerAddress);

client.on("error", (err) => {
  console.error("Connection error:", err);
  process.exit(1);
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe(topicTemperature, { qos: 1 });
  client.subscribe(topicCurrent, { qos: 1 });
  client.subscribe(topicVoltage, { qos: 1 });
});

client.on("message", (topic, message) => {
  console.log(`Received message from topic: ${topic}`);
  sendIncomingData({
    topic: topic,
    message: message.toString(),
  });
});
