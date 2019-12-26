/* eslint-disable import/no-extraneous-dependencies */
const inquirer = require("inquirer");
const chaiHttp = require("chai-http");
const chai = require("chai");
require("dotenv").config();

const { Environment } = require("../values");
const {
  PostServicePayload,
  FakeJWTToken,
} = require("./fixtures");
const { FileUtils } = require("../utils");

chai.use(chaiHttp);

function startAPI() {
  const server = require("../index");
  chai.request(server).get("/"); // initialize server
}

function callEndpoint(callCount, endpoint, payload, host) {
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

  const chaiRequest = chai.request(host);

  // ensure that ids in payload reference valid objects
  // different environments reference different databases
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < callCount; i++) {
    setTimeout(() => {
      chaiRequest
        .post(endpoint)
        .set("content-type", "application/json")
        .set("token", FakeJWTToken)
        .set("agentId", "5cdf5367cbc99526685bd64f")
        .set("email", "mosss@gmail.com")
        .send(payload)
        .end((httpErr, res) => {
          if (httpErr) {
            console.log(httpErr);
            process.exit(1);
          }
          try {
            const fileName = `src/mock/srvice-mock-data-${(new Date()).getTime().toString()}.txt`;
            FileUtils.writeToFile(fileName, JSON.stringify(res, null, 2));
            console.log(`Logged results of calling POST ${host}${endpoint} ${callCount} times in ${fileName}`);
          } catch (fileErr) {
            console.log(fileErr);
            process.exit(1);
          }
        }, 3000);
    });
  }
}

(async () => {
  try {
    let inputResponses = await inquirer.prompt([{
      name: "environment",
      message: "Which Srvice API environment would you like to use? ",
      default: process.env.NODE_ENV,
      choices: ["TEST", "SANDBOX_01"],
      type: "list",
    },
    {
      name: "endpoint",
      message: "Which endpoint would you like to send a POST request to?",
      choices: ["/service"],
      type: "list",
    }]);

    console.log(inputResponses);

    const { environment, endpoint } = inputResponses;
    process.env.NODE_ENV = environment;

    inputResponses = Object.assign(inputResponses, await inquirer.prompt({
      name: "count",
      message: `How many times would you like to call POST \
"localhost:${Environment.getGurrentPort()}${endpoint}" in ENV: ${environment}?`,
      type: "input",
    }));

    const { count } = inputResponses;

    startAPI();
    callEndpoint(count, endpoint, PostServicePayload);
  } catch (err) {
    console.log(err);
  }
})();

