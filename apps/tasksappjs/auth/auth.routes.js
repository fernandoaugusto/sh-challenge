const  express =  require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/login", authController.postLogin);

module.exports =  router;