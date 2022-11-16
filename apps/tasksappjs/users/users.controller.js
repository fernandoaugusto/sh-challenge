
const usersService = require('./users.service');

class UsersController {

    static async postUsers(req, res, next){
        try {
          const seed = await usersService.seedUsersIfNotExists();
          if (!seed) {
            throw new Error('Database is already seeded!');
          }
          const response = {
            status_code: 200
          }
          res.status(200).json(response);
        } catch (error) {
          const err_response = {
            status_code: 400,
            message: [ error.message ]
          }
          res.status(400).json(err_response)
        }
    }

    static async postUserWSAllowance(req, res, next){
      try {
        const sent_allowance = await usersService.sendAllowanceUserClient(req.body.client_id, req.user.id);
        res.status(200).send(sent_allowance);
      } catch (error) {
        const error_response = {
          status_code: 400,
          message: [ error.message ]
        }
      }
  }

}

module.exports = UsersController;




