const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");

const { AgentModel, AgentPrivateModel, UserModel, UserPrivateModel } = require("../models/");
const { AWSValues } = require("../values/");

AWS.config = new AWS.Config(AWSValues.config);

const userPool = new AmazonCognitoIdentity.CognitoUserPool(AWSValues.cognito.sandbox);

class AuthenticationManager {
  constructor(cognitoService, agentService, agentPrivateService, userService, userPrivateService, jwtService) {
    this.cognitoService = cognitoService;
    this.agentService = agentService;
    this.agentPrivateService = agentPrivateService;
    this.userService = userService;
    this.userPrivateService = userPrivateService;
    this.jwtService = jwtService;
  }

  async signupAgent(agent) {
    const {
      email,
      firstName,
      lastName,
      password,
      dateJoined,
      profilePictureUrl,
      services,
      location,
      languages,
      company,
      education,
      certifications,
      phone,
      governmentIdUrl,
      secondaryIdUrl,
      selfieUrl,
      givenRatings,
      bookings,
      skills,
    } = agent;

    try {
      await this.cognitoService.createAccount(firstName, lastName, email, password);
      const newAgent = new AgentModel({
        email,
        firstName,
        lastName,
        dateJoined,
        profilePictureUrl,
        services,
        location,
        languages,
        company,
        education,
        certifications,
        skills,
      });
      const newAgentPrivate = new AgentPrivateModel({
        email,
        phone,
        governmentIdUrl,
        secondaryIdUrl,
        selfieUrl,
        givenRatings,
        bookings,
      });
      const newUser = new UserModel({ email, firstName, lastName, dateJoined, profilePictureUrl });
      const newUserPrivate = new UserPrivateModel({
        email,
        phone,
        savedServices: [],
        givenRatings: [],
        requests: [],
        bookings: [],
      });
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

  async signupUser({
    email,
    firstName,
    lastName,
    password,
    dateJoined,
    profilePictureUrl,
    phone,
    savedServices,
    givenRatings,
    requests,
    bookings,
  }) {
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

  async adminConfirmUser({ email }) {
    try {
      const adminConfirmationResult = await this.cognitoService.adminConfirmAccount(email);
      const successMessage = "Confirmed account successfully";

      return {
        status: 200,
        json: {
          message: successMessage,
          cognitoRes: adminConfirmationResult,
        },
      };
    } catch (error) {
      return { status: 500, json: error.toString() };
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
}

module.exports = AuthenticationManager;
