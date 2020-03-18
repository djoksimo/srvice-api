import { sign, verify } from "jsonwebtoken";
import { Secrets } from "../values";

const SECRET_JWT_KEY = Secrets.JWT_KEY;

export default class JwtService {
  static get SECRET_JWT_KEY() {
    return SECRET_JWT_KEY;
  }

  createTokenFromEmail(email) {
    return new Promise((resolve) => {
      sign({ email }, JwtService.SECRET_JWT_KEY, (error, token) => {
        resolve(token);
      });
    });
  }

  getEmailFromToken(token) {
    return new Promise((resolve, reject) => {
      verify(token, JwtService.SECRET_JWT_KEY, (error, authData) => {
        if (error) {
          reject(error);
        }
        resolve(authData);
      });
    });
  }
}
