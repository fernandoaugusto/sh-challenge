const  express =  require("express");
const router = express.Router();
const usersController = require("./users.controller");
const { authGuard } = require('../guards/auth.guard');
const { managerRoleGuard } = require('../guards/roles.guard');

router.post("/seed", usersController.postUsers);
router.post("/ws/allowance", authGuard, managerRoleGuard, usersController.postUserWSAllowance);

module.exports =  router;