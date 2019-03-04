const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

class CognitoService {

  constructor() {
    AWS.config = new AWS.Config({
      region: "us-east-1",
      accessKeyId: "AKIAJX7UB3Q56ZXUKHRQ",
      secretAccessKey: "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",
    });
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: "us-east-1_PQ6pkrE6F",
      ClientId: "674mh87fc0bg8m588r8sslf87q",
    });
  }

  createAccount(firstName, lastName, password, email) {
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
}

module.exports = CognitoService;
