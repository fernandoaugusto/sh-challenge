# SH Challenge

This challenge was written in Javascript.

- The project was built with NodeJS, RabbitMQ, MySQL and Docker Compose.

There are 4 Dockerized apps, and 1 outside Docker (only script)):

[Script] TaskViewer:
This app will log in automatically to Manager Account and connect to Websocket to receive Tasks finished by Technicians

[Docker] Notifications: 
It is responsible to listen RabbitMQ to receive events and send messages via Websocket to Taskviewer app.
The events from RabbitMQ are: 'notify.taskdone' and 'user.allowed', which ones are respectively responsible for Notify tasks finished and Allow User and Client to receive messages via Websockets.

[Docker] TasksAppJS: 
It is the core app, where it is ready to receive HTTP Requests for User Login, New Tasks, Update Tasks, Delete Tasks and List Tasks (according user role). It is connected to RabbitMQ in order to send messages to Queue.

[Docker] MySQL

[Docker] RabbitMQ 

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- [NodeJS](https://nodejs.org/) and NPM.
- [Docker](https://www.docker.com/).

### 1.2 Project configuration 

Start by cloning this project on your workstation.

``` sh
git clone https://github.com/fernandoaugusto/sh-challenge
```

#### 1.2.1 Using Docker Compose to install all dependencies

The next thing will be to install the dependencies of Dockerized Services, except TaskViewer script, which one will be installed later described in item 2.2.

``` sh
cd sh-challenge
docker compose up
```

WARNING: In order to make life easier, all the .env files are already set. In a real life project it would not be done.

#### 1.2.2 Installing dependencies for Taskviewer

This procedure will install packages for Taskviewer script.

``` sh
cd apps
cd taskviewer
npm install
```

## 2. Running the project

### 2.1 Backend services

In the console, run the following command once you are in the root of the project, where docker-compose.yml is present. 

``` sh
docker compose up
```

WARNING: Wait until you receive the message "TasksAppJS on port 3000".

### 2.2 Taskviewer script

In a separate console, go to the root of the project.

``` sh
cd apps
cd taskviewer
```

Are the services ready?
So run the command below in Taskviewer folder:

``` sh
npm run start
```

### 2.3 Login

There are 3 users already seeded in the database (if you executed step 2.1 and 2.2)

``` sh
POST http://localhost:3000/api/v1/auth/login

//Manager
{
    "email": "nikola@shmail.com",
    "password": "123456"
}

//Technician #1
{
    "email": "thomas@shmail.com",
    "password": "123456"
}

//Technician #2
{
    "email": "wosniak@shmail.com",
    "password": "123456"
}
```

### 2.4 Create New Task

Create a task logged as Technician. Manager user cannot create tasks.

``` sh
//headers
x-auth: TOKEN-GOT-FROM-LOGIN


POST http://localhost:3000/api/v1/tasks

{
    "title": "Text for Title",
    "summary": "Text for Summary",
    "is_finished": false
}

```

### 2.5 Update Task

Only Technicians can update their own tasks.
If you flag 'is_finished' with 'true', the TaskViewer will receive the message.

``` sh
//headers
x-auth: TOKEN-GOT-FROM-LOGIN

// replace [:task_id] by the 'ID' in Response from New Task or List Tasks

PUT http://localhost:3000/api/v1/tasks/[:task_id]

{
    "title": "Text for Title Changed",
    "summary": "Text for Summary Changed",
    "is_finished": true
}

```

### 2.6 List Tasks

Technicians can view their own tasks. Manager user can see all.

``` sh
//headers
x-auth: TOKEN-GOT-FROM-LOGIN

GET http://localhost:3000/api/v1/tasks

```

### 2.7 Delete Task

If you are logged as Manager, you can delete a specific Task.

``` sh
//headers
x-auth: TOKEN-GOT-FROM-LOGIN

// replace [:task_id] by the 'ID' in Response from New Task or List tasks

DELETE http://localhost:3000/api/v1/tasks/[:task_id]

```