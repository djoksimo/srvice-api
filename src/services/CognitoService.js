const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const { AWSValues } = require("../values");

class CognitoService {
  constructor() {
    AWS.config = new AWS.Config(AWSValues.config);
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(AWSValues.cognito.sandbox);
  }

  createAccount(firstName, lastName, email, password) {
    const dataFirstName = { Name: "given_name", Value: firstName };
    const dataLastName = { Name: "family_name", Value: lastName };
    const dataEmail = { Name: "email", Value: email };
    const attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(dataFirstName));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(dataLastName));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  confirmAccount(email, code) {
    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (error, cognitoResult) => {
        if (error) {
          reject(error);
        }
        resolve(cognitoResult);
      });
    });
  }

  adminConfirmAccount(email) {
    const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();

    const confirmParams = {
      UserPoolId: AWSValues.cognito.sandbox.UserPoolId,
      Username: email,
    };

    return new Promise((resolve, reject) => {
      cognitoServiceProvider.adminConfirmSignUp(confirmParams, (error, cognitoResult) => {
        if (error) {
          reject(error);
        }
        resolve(cognitoResult);
      });
    });
  }

  loginAccount(email, password) {
    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: error => {
          reject(error);
        },
      });
    });
  }
}

module.exports = CognitoService;
