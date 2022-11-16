const authService = require('../auth/auth.service');

const technicianRoleGuard = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error('User was not identified.');
      }
      if (req.user.type != 'TECHNICIAN') {
        throw new Error('User cannot access the resource.');
      }
      next();
    } catch(error) {
      const error_response = {
        status_code: 401,
        message: [ error.message ]
      };  
      res.status(401).json(error_response);
    }
}

const managerRoleGuard = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error('User was not identified.');
      }
      if (req.user.type != 'MANAGER') {
        throw new Error('User cannot access the resource.');
      }
      next();
    } catch(error) {
      const error_response = {
        status_code: 401,
        message: [ error.message ]
      };  
      res.status(401).json(error_response);
    }
}

module.exports = { technicianRoleGuard, managerRoleGuard }