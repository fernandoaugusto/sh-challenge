var emitter = require('../ws/emitter.service')

class RMQEvent {

  #amqpConn;
  #queue;
  #event_pattern;

  constructor(amqpConn, queue, event_pattern) {
    this.#amqpConn = amqpConn;
    this.#queue = queue;
    this.#event_pattern = event_pattern;
  }

  startConsumer() {
    try {
      let amqpChannel = null;
      const amqpConn = this.#amqpConn;
      const queue = this.#queue;
      const event_pattern = this.#event_pattern;
      const processMessage = this.#processMessage;
      amqpConn.createChannel(function(err, channel) {
        amqpChannel = channel;
        if (err) throw new Error('Channel was not created.');
        amqpChannel.on("error", function(err) {
          throw new Error(err.message);
        });
        amqpChannel.on("close", function() {
          console.error(`[RMQ:${event_pattern}] Consumer was closed!`);
        });
        amqpChannel.prefetch(10);
        amqpChannel.assertQueue(queue, { durable: true }, function(err, _ok) {
          if (err) throw new Error('Cannot listen queue.');
          amqpChannel.consume(queue, (message) => processMessage(message, amqpConn, amqpChannel, event_pattern), { noAck: false });
          console.log(`[RMQ] Listening events from pattern ${event_pattern}`);
        });
      });
    } catch (error) {
      console.error(`[RMQ:${event_pattern}] Consumer Error: ${error.message}`);
      this.getAmqpConn().close();
      return;
    } 

  }

  #processMessage(message, amqpConn, amqpChannel, event_pattern) {
    try {
      const rmq_message = JSON.parse(message.content.toString());
      const ws_message = {
        pattern: rmq_message.pattern,
        data: rmq_message.data
      }
      if (event_pattern == rmq_message.pattern) {
        console.log(`[RMQ:${event_pattern}] Message received:`, rmq_message.data);
        emitter.eventBus.sendEvent('SEND_WS_MESSAGE', ws_message);
        amqpChannel.ack(message);
      } else {
        amqpChannel.reject(message, true);
      }
    } catch (error) {
        console.log("[RMQ] Error:", error.message);
        amqpConn.close();
    }
  }
  
}

module.exports = { RMQEvent };