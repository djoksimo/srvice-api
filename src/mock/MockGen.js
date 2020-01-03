const chai = require("chai");
require("dotenv").config();

const {
  PostServicePayload,
  MockAgentCredentials,
} = require("./fixtures");
const { FileUtils, OutputUtils } = require("../utils");
const { HTTPVerbs } = require("../enums");

class MockGen {
  static startAPI() {
    const server = require("../index");
    chai.request(server).get("/"); // initialize server
  }

  static async writeResultsToFile(mockRequests, fileName, successMessage) {
    try {
      const results = await Promise.all(mockRequests);

      await FileUtils.asyncWriteToFileOnce(fileName, results.join("\n"));
      console.log(successMessage);
      process.exit(0);
    } catch (fileErr) {
      console.log(fileErr);
      process.exit(1);
    }
  }

  static getAuthenticatedChaiRequest(endpoint, HTTPVerb, host, authHeaders, payload) {
    if (!host) {
      host = "http://localhost:5000";
    }
  
    let chaiRequest = chai.request(host);

    switch (HTTPVerb) {
      case HTTPVerbs.POST:
        chaiRequest = chaiRequest.post(endpoint);
        break;
      case HTTPVerbs.PATCH:
        chaiRequest = chaiRequest.patch(endpoint);
        break;
      case HTTPVerbs.DELETE:
        chaiRequest = chaiRequest.delete(endpoint);
        break;
      case HTTPVerbs.PUT:
        chaiRequest = chaiRequest.put(endpoint);
        break;
      case HTTPVerbs.GET:
        chaiRequest = chaiRequest.get(endpoint);
        break;
      default:
        console.log("Invalid HTTP Verb");
        process.exit(1);
    }

    if (authHeaders) {
      chaiRequest = chaiRequest
        .set("token", authHeaders.token)
        .set("agentId", authHeaders.agentId)
        .set("email", authHeaders.email);
    }

    return chaiRequest
      .set("content-type", "application/json")
      .send(payload);
  }
  
  static async callEndpoint(callCount, endpoint, payload, host) {
    if (!callCount || callCount > 100) {
      console.log("Call count that was specified was too risky, please try again with a smaller number");
      process.exit(1);
    }

    if (!host) {
      host = "http://localhost:5000";
    }
  
    if (!payload) {
      switch (endpoint) {
        case "/service":
          payload = PostServicePayload;
          break;
        default:
          payload = {};
      }
    }

    const mockRequests = [];

    // ensure that ids in payload reference valid objects
    // different environments reference different databases
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < callCount; i++) {
      // eslint-disable-next-line no-loop-func
      const endRequestPromise = new Promise((resolve) => {
        MockGen.getAuthenticatedChaiRequest(
          endpoint,
          HTTPVerbs.POST, 
          host, 
          MockAgentCredentials, 
          payload,
        ).end((httpErr, res) => {
          if (httpErr) {
            console.log(httpErr);
            process.exit(1);
          }
          const fileOutput = "~~~RESULT #" + (i + 1) + "~~~~:\n" +
              OutputUtils.getPrettyJSON(res) +
              "\nresponse: " + OutputUtils.getPrettyJSON(res.body) + 
              "\n~~~~~~~\n";

          resolve(fileOutput);
        });
      });
      mockRequests.push(endRequestPromise);      
    }

    const fileName = `src/mock/srvice-mock-data-${(new Date()).getTime().toString()}.txt`;
    const successMessage = `Logged results of calling POST ${host}${endpoint} ${callCount} times in ${fileName}`;
    MockGen.writeResultsToFile(mockRequests, fileName, successMessage);
  }
}

module.exports = MockGen;
