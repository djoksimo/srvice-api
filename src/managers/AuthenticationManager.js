const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
  AgentModel,
  AgentPrivateModel,
  UserModel,
  UserPrivateModel
} = require("../models/");

const route = "/auth/";

// prod
// const poolData = {
//   UserPoolId: "us-east-1_5LnENujLz",
//   ClientId: "7stqncgt58t6tk6sokoa57ajbd",
// };

// sandbox 01
const poolData = {
  UserPoolId: "us-east-1_PQ6pkrE6F",
  ClientId: "674mh87fc0bg8m588r8sslf87q",
};

AWS.config = new AWS.Config({
  region: "us-east-1",
  accessKeyId: "AKIAJX7UB3Q56ZXUKHRQ",
  secretAccessKey: "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",
});

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const secretJwtKey = "8xStlNM+DbJTIQ0zOk+3X00gngEB9JOEKiVMYWAVWfc";

const clientId = "107550134059-tttr1lbgnc499l32hhc9vt7pnkf5fij5.apps.googleusercontent.com";
const client = new OAuth2Client(clientId);

class AuthenticationManager {

  constructor(UserManager, CognitoService, AgentService, AgentPrivateService, UserService, UserPrivateService) {
    this._userManager = UserManager;
    this.cognitoService = CognitoService;
    this.agentService = AgentService;
    this.agentPrivateService = AgentPrivateService;
    this.userService = UserService;
    this.userPrivateService = UserPrivateService;
  }

  async signupAgent({ email, firstName, lastName, password, dateJoined, profilePictureUrl, services, location, languages, company, education, certifications, phone, governmentIdUrl, secondaryIdUrl, selfieUrl, givenRatings, bookings }) {
    try {
      await this.cognitoService.createAccount(firstName, lastName, email, password);
      const newAgent = new AgentModel({ email, firstName, lastName, dateJoined, profilePictureUrl, services, location, languages, company, education, certifications });
      const newAgentPrivate = new AgentPrivateModel({ email, phone, governmentIdUrl, secondaryIdUrl, selfieUrl, givenRatings, bookings });
      const newUser = new UserModel({ email, firstName, lastName, dateJoined, profilePictureUrl });
      const newUserPrivate = new UserPrivateModel({ email, phone, savedServices: [], givenRatings: [], requests: [], bookings: [] });
      await this.agentService.createAgent(newAgent);
      await this.agentPrivateService.createAgentPrivate(newAgentPrivate);
      await this.userService.createUser(newUser);
      await this.userPrivateService.createUserPrivate(newUserPrivate);
      return { status: 201, json: {} };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async confirmAgent({ email, code }) {
    try {
      await this.cognitoService.confirmAccount(email, code);
      const agentDocument = await this.agentService.getAgentByEmail(email);
      const agentPrivateDocument = await this.agentPrivateService.getAgentPrivateByEmail(email);
      const agent = Object.assign({}, agentPrivateDocument.toObject(), agentDocument.toObject());
      const token = await this.createTokenFromEmail(email);
      return { status: 200, json: { agent, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async signupUser({ email, firstName, lastName, password, dateJoined, profilePictureUrl, phone, savedServices, givenRatings, requests, bookings }) {
    try {
      await this.cognitoService.createAccount(firstName, lastName, email, password);
      const newUser = new UserModel({ email, firstName, lastName, dateJoined, profilePictureUrl });
      const newUserPrivate = new UserPrivateModel({ email, phone, savedServices, givenRatings, requests, bookings });
      await this.userService.createUser(newUser);
      await this.userPrivateService.createUserPrivate(newUserPrivate);
      return { status: 201, json: {} };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async confirmUser({ email, code }) {
    try {
      await this.cognitoService.confirmAccount(email, code);
      const userDocument = await this.userService.getUserByEmail(email);
      const userPrivateDocument = await this.userPrivateService.getUserPrivateByEmail(email);
      const user = Object.assign({}, userPrivateDocument.toObject(), userDocument.toObject());
      const token = await this.createTokenFromEmail(email);
      return { status: 200, json: { user, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async createTokenFromEmail(email) {
    return await new Promise(resolve => {
      jwt.sign({ email }, secretJwtKey, (err, token) => {
        resolve(token);
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
      const token = await this.createTokenFromEmail(email);

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
      const userId = payload["sub"];

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
        const token = await this.createTokenFromEmail(email);
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
      const token = await this.createTokenFromEmail(email);
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

  async _signupMongo(firstName, lastName, email) {
    const newUser = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      dateJoined: new Date(),
      profilePictureUrl: "",
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

  async signup({ firstName, lastName, email, password }) {
    try {
      await this.cognitoService.createAccount(firstName, lastName, email, password);
      await this._signupMongo(firstName, lastName, email);
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
      const userResult = await this._userManager.find(email);
      const user = userResult.json.result;
      const token = await this.createTokenFromEmail(email);
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
      const userResult = await this._userManager.find(result.email);
      const user = userResult.json.result;
      return { status: 200, json: user };
    } catch (error) {
      return { status: 403, json: error };
    }
  }
}

module.exports = AuthenticationManager;
