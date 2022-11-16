const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');
const User = require('../users/user.entity');
const Task = require('../tasks/task.entity');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }
);

const models = [ User, Task ].map(m => m(sequelize, DataTypes, UUIDV4));

sequelize.sync().then(console.log('Database sync is ready!'));

module.exports = sequelize;