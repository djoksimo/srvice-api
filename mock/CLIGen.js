/* eslint-disable import/no-extraneous-dependencies */
const inquirer = require("inquirer");
const chaiHttp = require("chai-http");
const chai = require("chai");
const chalk = require("chalk");
require("dotenv").config();

const { Environment } = require("../src/values");
const { PostServicePayload } = require("./fixtures");
const MockGen = require("./MockGen");
const server = require("../src/index");

chai.use(chaiHttp);

(async function startCLIGen() {
  try {
    console.log(chalk.white.bgBlue.bold("Starting Srvice mock data generation !!!"));
    let inputResponses = await inquirer.prompt([
      {
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
      },
    ]);

    const { environment, endpoint } = inputResponses;
    process.env.NODE_ENV = environment;

    inputResponses = Object.assign(
      inputResponses,
      await inquirer.prompt({
        name: "count",
        message: `How many times would you like to call POST \
localhost:${Environment.getGurrentPort()}${endpoint} in ENV: ${environment}?`,
        type: "input",
      }),
    );

    const { count } = inputResponses;

    MockGen.startAPI(server(5002));
    MockGen.callEndpoint(count, endpoint, PostServicePayload);
  } catch (err) {
    console.log(err);
  }
})();
