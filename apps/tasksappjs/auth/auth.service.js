var jwt = require('jsonwebtoken');
const usersService = require('../users/users.service');


class AuthService {

    static async authentication(login) {
        try {
            let auth = await usersService.getUserByEmailAndPassword(login);
            auth['token'] = this.generateTokenForUser(auth.id);
            return auth;
          } catch(error) {
            throw new Error(error.message);
          }
    }

    static generateTokenForUser(user_id) {
        const sign_jwt = { user_id };
        const expires_jwt = { expiresIn: 60*30 }; // 30 minutes
        const token = jwt.sign(sign_jwt, process.env.SECRET_JWT, expires_jwt);
        return token;
    }

    static async getUserFromToken(token) {
      try {
        const token_data = jwt.verify(token, process.env.SECRET_JWT);
        const user = await usersService.getUserByID(token_data.user_id);
        return user.dataValues;
      } catch (error) {
        throw new Error('Token is invalid or expired.');
      }
    }

}

module.exports = AuthService;