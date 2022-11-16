const  express =  require("express");
const router = express.Router();
const TasksController = require("./tasks.controller");
const { authGuard } = require('../guards/auth.guard');
const { technicianRoleGuard, managerRoleGuard } = require('../guards/roles.guard');

router.post("/", authGuard, technicianRoleGuard, TasksController.postTask);
router.get("/", authGuard, TasksController.getTasks);
router.delete("/:task_id", authGuard, managerRoleGuard, TasksController.deleteTasks);
router.put("/:task_id", authGuard, technicianRoleGuard, TasksController.putTaskByID);

module.exports =  router;