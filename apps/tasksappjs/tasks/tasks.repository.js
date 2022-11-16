const sequelize = require('../database/sequelize');

const TasksRepository = sequelize.models.tasks;

module.exports = TasksRepository;