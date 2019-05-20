const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");
// const { OAuth2Client } = require("google-auth-library");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

const {
  AgentModel,
  AgentPrivateModel,
  UserModel,
  UserPrivateModel
} = require("../models/");

// const route = "/auth/";

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
// const secretJwtKey = "8xStlNM+DbJTIQ0zOk+3X00gngEB9JOEKiVMYWAVWfc";

// const clientId = "107550134059-tttr1lbgnc499l32hhc9vt7pnkf5fij5.apps.googleusercontent.com";
// const client = new OAuth2Client(clientId);

class AuthenticationManager {

  constructor(CognitoService, AgentService, AgentPrivateService, UserService, UserPrivateService, JwtService) {
    this.cognitoService = CognitoService;
    this.agentService = AgentService;
    this.agentPrivateService = AgentPrivateService;
    this.userService = UserService;
    this.userPrivateService = UserPrivateService;
    this.jwtService = JwtService;
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
      const token = await this.jwtService.createTokenFromEmail(email);
      return { status: 200, json: { agent, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async loginAgent({ email, password }) {
    try {
      await this.cognitoService.loginAccount(email, password);
      const agentDocument = await this.agentService.getAgentByEmail(email);
      if (!agentDocument) {
        return { status: 404, json: { code: "AccountExistsNotAgent" } };
      }
      const agentPrivateDocument = await this.agentPrivateService.getAgentPrivateByEmail(email);
      const agent = Object.assign({}, agentPrivateDocument.toObject(), agentDocument.toObject());
      const token = await this.jwtService.createTokenFromEmail(email);
      return { status: 200, json: { agent, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async verifyAgentToken({ token }) {
    try {
      const result = await this.jwtService.getEmailFromToken(token);
      const { email } = result;
      if (!email) {
        return { status: 403, json: result };
      }
      const agentDocument = await this.agentService.getAgentByEmail(email);
      const agentPrivateDocument = await this.agentPrivateService.getAgentPrivateByEmail(email);
      const agent = Object.assign({}, agentPrivateDocument.toObject(), agentDocument.toObject());
      return { status: 200, json: agent };
    } catch (error) {
      return { status: 403, json: error };
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
      const userDocument = await this.userService.findUserByEmail(email);
      const userPrivateDocument = await this.userPrivateService.getUserPrivateByEmail(email);
      const user = Object.assign({}, userPrivateDocument.toObject(), userDocument.toObject());
      const token = await this.jwtService.createTokenFromEmail(email);
      return { status: 200, json: { user, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async loginUser({ email, password }) {
    try {
      await this.cognitoService.loginAccount(email, password);
      const userDocument = await this.userService.findUserByEmail(email);
      const userPrivateDocument = await this.userPrivateService.getUserPrivateByEmail(email);
      const user = Object.assign({}, userPrivateDocument.toObject(), userDocument.toObject());
      const token = await this.jwtService.createTokenFromEmail(email);
      return { status: 200, json: { user, token } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async verifyUserToken({ token }) {
    try {
      const result = await this.jwtService.getEmailFromToken(token);
      const { email } = result;
      if (!email) {
        return { status: 403, json: result };
      }
      const userDocument = await this.userService.findUserByEmail(email);
      const userPrivateDocument = await this.userPrivateService.getUserPrivateByEmail(email);
      const user = Object.assign({}, userPrivateDocument.toObject(), userDocument.toObject());
      return { status: 200, json: user };
    } catch (error) {
      return { status: 403, json: error };
    }
  }

  async authenticateIdEmailToken({ userId, agentId, email, token }) {
    if (userId) {
      const userDocument = await this.userService.findNonPopulatedUserById(userId);
      if (userDocument && userDocument.email === email) {
        return await this.authenticateEmailToken(email, token);
      }
    } else if (agentId) {
      const agentDocument = await this.agentService.getNonPopulatedAgentById(agentId);
      if (agentDocument && agentDocument.email === email) {
        return await this.authenticateEmailToken(email, token);
      }
    }
    throw new Error();
  }

  async authenticateEmailToken(email, token) {
    const jwtResult = await this.jwtService.getEmailFromToken(token);
    if (jwtResult.email !== email) {
      throw new Error();
    }
  }

  async resendConfirmation(payload) {
    const { email } = payload;
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    try {
      const result = await new Promise((resolve, reject) => {
        cognitoUser.resendConfirmationCode((error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
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

  // async signupGoogle(data) {
  //   const { firstName, lastName, email, googleToken } = data;
  //
  //   try {
  //     const googleResult = await this.verifyGoogle(googleToken);
  //     const userResult = await this._userService.findUserByEmail(email);
  //     if (userResult != null) {
  //       return {
  //         status: 500,
  //         json: {
  //           message: "User already exists",
  //         },
  //       };
  //     }
  //     const mongoResult = await this._signupMongo({ firstName, lastName, email });
  //     const token = await this.jwtService.createTokenFromEmail(email);
  //
  //     return {
  //       status: 200,
  //       json: {
  //         message: "User added to database via Google Sign In",
  //         googleResult,
  //         mongoResult,
  //         token,
  //       },
  //     };
  //   } catch (error) {
  //     return { status: 500, json: error };
  //   }
  // }

  // async verifyGoogle(googleToken) {
  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: googleToken,
  //       audience: clientId,
  //     });
  //
  //     const payload = ticket.getPayload();
  //     const userId = payload.sub;
  //
  //     return {
  //       status: 200,
  //       json: {
  //         payload,
  //         userId,
  //       },
  //     };
  //   } catch (error) {
  //     return { status: 403, json: error };
  //   }
  // }

  // async loginGoogle(data) {
  //   const { firstName, lastName, email, googleToken } = data;
  //   const googleResult = await this.verifyGoogle(googleToken);
  //   const userResult = await this._userService.findUserByEmail(email);
  //   if (userResult == null) {
  //     try {
  //       const mongoResult = await this._signupMongo({ firstName, lastName, email });
  //       const token = await this.jwtService.createTokenFromEmail(email);
  //       return {
  //         status: 200,
  //         json: {
  //           googleResult,
  //           mongoResult,
  //           token,
  //         },
  //       };
  //     } catch (error) {
  //       return { status: 500, json: error };
  //     }
  //
  //   } else {
  //     const token = await this.jwtService.createTokenFromEmail(email);
  //     return {
  //       status: 200,
  //       json: {
  //         googleResult,
  //         token,
  //       },
  //     };
  //   }
  // }
}

module.exports = AuthenticationManager;