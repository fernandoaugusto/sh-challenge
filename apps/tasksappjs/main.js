require('dotenv').config();
const express = require('express');
const bodyParser =  require("body-parser");
const Sequelize = require("sequelize");
const authRoutes = require("./auth/auth.routes");
const usersRoutes = require("./users/users.routes");
const tasksRoutes = require("./tasks/tasks.routes");

const app = express();
const sequelize = require('./database/sequelize');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/tasks", tasksRoutes);

app.listen(PORT, () => {
    console.log(`TasksAppJS on port ${PORT}`);
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });    
});
