const jwt = require("jsonwebtoken");

const SECRET_JWT_KEY = "8xStlNM+DbJTIQ0zOk+3X00gngEB9JOEKiVMYWAVWfc";

class JwtService {
  static get SECRET_JWT_KEY() { return SECRET_JWT_KEY; }

  createTokenFromEmail(email) {
    return new Promise((resolve) => {
      jwt.sign({ email }, JwtService.SECRET_JWT_KEY, (error, token) => {
        resolve(token);
      });
    });
  }

  getEmailFromToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JwtService.SECRET_JWT_KEY, (error, authData) => {
        if (error) {
          reject(error);
        }
        resolve(authData);
      });
    });
  }
}

module.exports = JwtService;
