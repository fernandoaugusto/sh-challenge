const _ = require('lodash');
var rmq = require('amqplib/callback_api');
const sequelize = require('../database/sequelize'); 
const tasksRepository = require('./tasks.repository');
const usersService = require('../users/users.service');
const { RMQ_URL, RMQ_QUEUE, RMQ_NOTIFY_TASKDONE } = process.env;

class UsersService {

    static async createTask(user_id, task) {
        try {
            const task_statement = { ...task, user_id };
            const saved_task = await tasksRepository.create(task_statement);
            return _.pick(saved_task.dataValues, ['id', 'title', 'summary', 'is_finished', 'created_date', 'updated_date']);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async listTasks() {
        try {
            const query_statement = 
            "SELECT tsk.id,tsk.title,tsk.summary,tsk.is_finished,tsk.created_date,tsk.updated_date,"+
            "(SELECT usr.id FROM users usr WHERE usr.id = tsk.user_id) as 'user_id',"+
            "(SELECT usr.first_name FROM users usr WHERE usr.id = tsk.user_id) as 'user_first_name',"+
            "(SELECT usr.last_name FROM users usr WHERE usr.id = tsk.user_id ) as 'user_last_name'"+
            "FROM tasks tsk";
            const tasks = await sequelize.query(query_statement, { type: sequelize.QueryTypes.SELECT });
            if (tasks.length == 0) {
                throw new Error('None task was found.');
            }
            return tasks;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async listTasksByUserID(user_id) {
        try {
            const tasks = await tasksRepository.findAll({
                where: {
                    user_id
                },
                attributes: [ 'id', 'title', 'summary', 'is_finished', 'created_date', 'updated_date' ]
            });
            if (tasks.length == 0) {
                throw new Error('None task was found.');
            }
            return tasks;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteTaskByID(task_id) {
        try {
            const deleted_task = await tasksRepository.destroy({
                where: {
                    id: task_id
                }
            })
            if (deleted_task != 1) {
                throw new Error('Task was not deleted.');
            }
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateTaskByID(task_id, task) {
        try {
            const task_found = await tasksRepository.findOne({
                where: { id: task_id },
                select: {
                    id: true, is_finished: true,
                    user: { id: true, first_name: true, last_name: true }
                },
                relations: { user: true }
            });
            if (!task_found.dataValues) {
                throw new Error('Task was not found.');
            }
            if (task_found.dataValues.is_finished == true) {
                throw new Error('Task is Done and cannot be updated.');
            }
            const update_statement = { title: task.title, summary: task.summary, is_finished: task.is_finished };
            const updated_task = await tasksRepository.update(
                update_statement, {
                    where: { id: task_id }
                });
            if (updated_task != 1) {
                throw new Error('Task was not updated.');
            }
            if (task.is_finished) {
                const task_found_message = await tasksRepository.findOne({
                    where: { id: task_id },
                    attributes: [ 'id', 'title', 'summary', 'is_finished', 'user_id', 'created_date', 'updated_date' ]
                });
                const user = await usersService.getUserByID(task_found_message.user_id);
                const message_rmq = {
                    pattern: RMQ_NOTIFY_TASKDONE,
                    data: {
                        id: task_found_message.id,
                        title: task_found_message.title,
                        summary: task_found_message.summary,
                        is_finished: task_found_message.is_finished,
                        created_date: task_found_message.created_date,
                        updated_date: task_found_message.updated_date,
                        user: {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            manager_id: user.manager_id
                        }
                    }                    
                }
                rmq.connect(RMQ_URL + "?heartbeat=60", function(err, rmqConnection) {
                    rmqConnection.createChannel(function(err, channel) {
                        channel.assertQueue(RMQ_QUEUE, { durable: true });
                        channel.sendToQueue(RMQ_QUEUE, Buffer.from(JSON.stringify(message_rmq)));
                    });
                });
            }
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }


}

module.exports = UsersService;