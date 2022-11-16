const authService = require('../auth/auth.service');

const authGuard = async (req, res, next) => {
    try {
      if (!req.headers['x-auth']) {
        throw new Error('Token on x-auth was not found.');
      }
      const auth_token = req.headers['x-auth'];
      const user = await authService.getUserFromToken(auth_token);
      const refreshed_token = authService.generateTokenForUser(user.id);
      req['user'] = { ...user, token: refreshed_token };
      next();
    } catch(error) {
      const error_response = {
        status_code: 401,
        message: [ error.message ]
      };  
      res.status(401).json(error_response);
    }
}

module.exports = { authGuard }