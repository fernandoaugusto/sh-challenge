
const tasksService = require('./tasks.service');

class TasksController {

  static async postTask(req, res, next) {
    try {
      const task = await tasksService.createTask(req.user.id, req.body);
      const response = { ...task, token: req.user.token }
      res.status(200).json(response);
    } catch (error) {
      const error_response = {
        status_code: 400,
        message: [ error.message ]
      };
      res.status(400).json(error_response);
    }
  }

  static async getTasks(req, res, next) {
    try {
      let tasks = [];
      if (req.user.type == 'TECHNICIAN') {
        console.log('TECHNICIAN');
        tasks = await tasksService.listTasksByUserID(req.user.id);
      } else {
        console.log('MANAGER');
        tasks = await tasksService.listTasks();
      }
      const response = { tasks, token: req.user.token };
      res.status(200).json(response);
    } catch (error) {
      const error_response = {
        status_code: 404,
        message: [ error.message ]
      };
      res.status(404).json(error_response);
    }
  }

  static async deleteTasks(req, res, next) {
    try {
      const deleted_task = await tasksService.deleteTaskByID(req.params.task_id);
      const response = { status_code: 200, token: req.user.token };
      res.status(200).json(response);
    } catch (error) {
      const error_response = {
        status_code: 400,
        message: [ error.message ]
      };
      res.status(404).json(error_response);
    }
  }

  static async putTaskByID(req, res, next) {
    try {
      const updated_task = await tasksService.updateTaskByID(req.params.task_id, req.body);
      const response = { status_code: 200, token: req.user.token };
      res.status(200).json(response);
    } catch (error) {
      const error_response = {
        status_code: 400,
        message: [ error.message ]
      };
      res.status(404).json(error_response);
    }
  }

}

module.exports = TasksController;