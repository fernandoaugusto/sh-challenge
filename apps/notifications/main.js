require('dotenv').config();
var rmq = require('amqplib/callback_api');
const { initWS } = require('./ws/ws.service');
var { RMQEvent } = require('./rmq/rmq.services');
const { RMQ_URL, RMQ_QUEUE, RMQ_NOTIFY_TASKDONE, RMQ_USER_ALLOWED } = process.env;

initWS(3001);

const initRMQ = () => {
  rmq.connect(RMQ_URL + "?heartbeat=60", function(err, rmqConnection) {
    if (err) {
      console.error("[RMQ]", err.message);
      return setTimeout(initRMQ, 1000);
    }
    rmqConnection.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[RMQ] Connection error", err.message);
      }
    });
    rmqConnection.on("close", function() {
      console.error("[RMQ] Reconnecting");
      return setTimeout(initRMQ, 1000);
    });
    console.log("[RMQ] Connected to RabbitMQ");
    const rmqEventNotifications = new RMQEvent(rmqConnection, RMQ_QUEUE, RMQ_NOTIFY_TASKDONE);
    const rmqEventUsersConnected = new RMQEvent(rmqConnection, RMQ_QUEUE, RMQ_USER_ALLOWED);
    rmqEventNotifications.startConsumer();
    rmqEventUsersConnected.startConsumer();
  });
}

initRMQ();
