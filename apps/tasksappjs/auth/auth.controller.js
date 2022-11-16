
const authService = require('./auth.service');

class AuthController {

    static async postLogin(req, res, next){
        try {
          const auth = await authService.authentication(req.body);
          res.status(200).json(auth);
        } catch (error) {
          const error_response = {
            status_code: 401,
            message: [ error.message ]
          }
          res.status(401).json(error_response)
        }
    }

}

module.exports = AuthController;