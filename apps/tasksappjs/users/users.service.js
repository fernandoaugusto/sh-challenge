const bcrypt = require('bcrypt');
const _ = require('lodash');
var rmq = require('amqplib/callback_api');
const usersRepository = require('./users.repository');
const { USER_MANAGER, USER_TECHNICIAN_1, USER_TECHNICIAN_2 } = require('../database/users.seed');
const { RMQ_URL, RMQ_QUEUE, RMQ_USER_ALLOWED } = process.env;

class UsersService {

    static async getUserByEmailAndPassword(login) {
        try {
            let user = await usersRepository.findOne({ 
                where: { email: login.email }
            });
            if (user) {
                const is_valid = await bcrypt.compare(login.password, user.password);
                if (is_valid) {
                    user = _.pick(user.dataValues, [ 'id', 'first_name', 'last_name', 'email', 'type' ]);
                    return user; 
                }
            }
            throw new Error('The user was not authorized.');
        } catch(error) {
            throw new Error(error.message);
        }
    }

    static async getUserByID(user_id) {
      try {
        let user = await usersRepository.findOne({ 
          where: { id: user_id }, 
          attributes: [ 'id', 'first_name', 'last_name', 'email', 'manager_id', 'type' ]
        });
        if (!user) {
          throw new Error('The user was not found.');
        }
        return user;
      } catch(error) {
        throw new Error(error.message);
      }
    }
  

    static async sendAllowanceUserClient(client_id, user_id) {
      try {
        const manager = await usersRepository.findOne({ id: user_id, type: 'MANAGER' });
        if (!manager) {
          throw new Error('User is not a Manager or doesnt exist. This User cannot receive notifications.');  
        }
        const message = {
          pattern: RMQ_USER_ALLOWED,
          data: { user_id, client_id }
        };
        rmq.connect(RMQ_URL + "?heartbeat=60", function(err, rmqConnection) {
          rmqConnection.createChannel(function(err, channel) {
              channel.assertQueue(RMQ_QUEUE, { durable: true });
              channel.sendToQueue(RMQ_QUEUE, Buffer.from(JSON.stringify(message)));
          });
        });
        return message;
      } catch(error) {
        throw new Error(error.message);
      }
    }

    static async seedUsersIfNotExists() {
        try {
            const users = await usersRepository.findAll();
            if (users.length == 0) {
                const user_manager = {
                    ...USER_MANAGER,
                    manager_id: null,
                    password: await bcrypt.hash('123456', 10)
                }
                const saved_manager = await usersRepository.create(user_manager);
                const user_technician_1 = {
                    ...USER_TECHNICIAN_1,
                    manager_id: saved_manager.dataValues.id,
                    password: await bcrypt.hash('123456', 10)
                }
                await usersRepository.create(user_technician_1);
                const user_technician_2 = {
                    ...USER_TECHNICIAN_2,
                    manager_id: saved_manager.dataValues.id,
                    password: await bcrypt.hash('123456', 10)
                }
                await usersRepository.create(user_technician_2);
                return true;
            }
            return false;
        } catch(error) {
            throw new Error(error.message);
        }
    }


}

module.exports = UsersService;