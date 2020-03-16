import AWS from "aws-sdk";

import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from "amazon-cognito-identity-js";
import { AWSValues } from "../values";

export default class CognitoService {
  userPool: CognitoUserPool;

  constructor() {
    AWS.config = new AWS.Config(AWSValues.config);
    this.userPool = new CognitoUserPool(AWSValues.cognito.sandbox);
  }

  createAccount(firstName: any, lastName: any, email: string, password: string) {
    const dataFirstName = { Name: "given_name", Value: firstName };
    const dataLastName = { Name: "family_name", Value: lastName };
    const dataEmail = { Name: "email", Value: email };
    const attributeList: CognitoUserAttribute[] = [];
    attributeList.push(new CognitoUserAttribute(dataFirstName));
    attributeList.push(new CognitoUserAttribute(dataLastName));
    attributeList.push(new CognitoUserAttribute(dataEmail));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  confirmAccount(email: any, code: string) {
    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (error, cognitoResult) => {
        if (error) {
          reject(error);
        }
        resolve(cognitoResult);
      });
    });
  }

  adminConfirmAccount(email: any) {
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

  loginAccount(email: any, password: any) {
    const userData = { Username: email, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (error) => {
          reject(error);
        },
      });
    });
  }
}
