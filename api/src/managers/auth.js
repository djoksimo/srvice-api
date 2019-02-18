const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require('aws-sdk');
const { OAuth2Client } = require('google-auth-library');

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");

const route = "/auth/";
const poolData = {
  UserPoolId: "us-east-1_5LnENujLz",
  ClientId: "7stqncgt58t6tk6sokoa57ajbd",
};

AWS.config = new AWS.Config({
  region: 'us-east-1',
  accessKeyId: 'AKIAJX7UB3Q56ZXUKHRQ',
  secretAccessKey: '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',
});

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const secretJwtKey = "8xStlNM+DbJTIQ0zOk+3X00gngEB9JOEKiVMYWAVWfc";

const clientId = '107550134059-tttr1lbgnc499l32hhc9vt7pnkf5fij5.apps.googleusercontent.com';
const client = new OAuth2Client(clientId);

class AuthManager {

  constructor(UserManager, UserService) {
    this._userManager = UserManager;
    this._userService = UserService;
  }

  _signupCognito(data) {
    const { firstName, lastName, password, email } = data;
    const dataFirstName = {
      Name: "given_name",
      Value: firstName,
    };
    const dataLastName = {
      Name: "family_name",
      Value: lastName,
    };
    const dataEmail = {
      Name: "email",
      Value: email,
    };
    const attributeList = [];
    const attributeFirstName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFirstName);
    const attributeLastName = new AmazonCognitoIdentity.CognitoUserAttribute(dataLastName);
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeFirstName);
    attributeList.push(attributeLastName);
    attributeList.push(attributeEmail);
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async signupGoogle(data) {
    const { firstName, lastName, email, googleToken } = data;

    try {
      const googleResult = await this.verifyGoogle(googleToken);
      const userResult = await this._userService.find(email);
      if (userResult != null) {
        return {
          status: 500,
          json: {
            message: "User already exists",
          },
        };
      }
      const mongoResult = await this._signupMongo({ firstName, lastName, email });
      const token = await this._getToken(email);

      return {
        status: 200,
        json: {
          message: "User added to database via Google Sign In",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route + "signup-google",
          },
          googleResult,
          mongoResult,
          token,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }

  }

  async verifyGoogle(googleToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      const userId = payload['sub'];

      return {
        status: 200,
        json: {
          payload,
          userId,
        },
      };
    } catch (error) {
      return { status: 403, json: error };
    }
  }

  async loginGoogle(data) {
    const { firstName, lastName, email, googleToken } = data;
    const googleResult = await this.verifyGoogle(googleToken);
    const userResult = await this._userService.find(email);
    if (userResult == null) {
      try {
        const mongoResult = await this._signupMongo({ firstName, lastName, email });
        const token = await this._getToken(email);
        return {
          status: 200,
          json: {
            message: "User added to database via Google Sign In",
            request: {
              type: "POST",
              url: "http://" + "165.227.42.141:5000" + route + "signup-google",
            },
            googleResult,
            mongoResult,
            token,
          },
        };
      } catch (error) {
        return { status: 500, json: error };
      }

    } else {
      const token = await this._getToken(email);
      return {
        status: 200,
        json: {
          message: "User logged in via Google Sign In",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route + "login-google",
          },
          googleResult,
          token,
        },
      };
    }
  }

  async _signupMongo(data) {
    const { firstName, lastName, email } = data;
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      dateJoined: new Date(),
    });
    return this._userService.create(newUser);
  }

  _loginCognito(credentials) {
    const { email, password } = credentials;
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (error) => {
          reject(error);
        },
        newPasswordRequired: () => {
          // TODO: consider option for when we're manually adding servers - Erik
          resolve({ asdf: "new password pls" });
        },
      });
    });
  }

  _getToken(email) {
    return new Promise((resolve) => {
      jwt.sign({ email }, secretJwtKey, (err, token) => {
        resolve(token);
      });
    });
  }

  _verifyToken(token) {
    return new Promise((resolve) => {
      jwt.verify(token, secretJwtKey, (err, authData) => {
        if (err) {
          resolve(err);
        } else {
          resolve(authData);
        }
      });
    });
  }

  async signup(data) {
    try {
      await this._signupCognito(data);
      return {
        status: 201,
        json: {
          message: "User added to cognito and database",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route + "signup",
          },
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async login(credentials) {
    const { email } = credentials;
    try {
      await this._loginCognito(credentials);
      const user = await this._userManager.find(email);
      const token = await this._getToken(email);
      return {
        status: 200,
        json: {
          user,
          token,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async confirm(credentials) {
    const { email, code } = credentials;
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    try {
      const result = await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(code, true, (error, cognitoResult) => {
          if (error) {
            reject(error);
          }
          resolve(cognitoResult);
        });
      });
      const token = await this._getToken(email);
      return {
        status: 200,
        json: {
          result,
          token,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async resendConfirmation(payload) {
    const { email } = payload;
    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    try {
      const result = await new Promise((resolve, reject) => {
        cognitoUser.resendConfirmationCode((error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
      return {
        status: 200,
        json: {
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async verifyToken(token) {
    const result = await this._verifyToken(token);
    if (!result.email) {
      return { status: 403, json: result };
    }
    try {
      const user = await this._userManager.find(result.email);
      return { status: 200, json: user };
    } catch (error) {
      return { status: 403, json: error };
    }
  }
}

module.exports = AuthManager;
