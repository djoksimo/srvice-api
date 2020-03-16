/* eslint-disable import/no-extraneous-dependencies */
import { prompt } from "inquirer";
import chaiHttp from "chai-http";
import { use } from "chai";
import { white } from "chalk";

import { Environment } from "../src/values";
import { PostServicePayload } from "./fixtures";
import { startAPI, callEndpoint } from "./MockGen";
import index from "../src";

require("dotenv").config();

use(chaiHttp);

(async function startCLIGen() {
  try {
    console.log(white.bgBlue.bold("Starting Srvice mock data generation !!!"));
    let inputResponses = await prompt([
      {
        name: "environment",
        message: "Which Srvice API environment would you like to use? ",
        default: process.env.NODE_ENV,
        choices: ["TEST", "DEVELOPMENT"],
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
      await prompt({
        name: "count",
        message: `How many times would you like to call POST \
localhost:${Environment.getGurrentPort()}${endpoint} in ENV: ${environment}?`,
        type: "input",
      }),
    );

    const { count } = inputResponses;

    startAPI(index(5002));
    callEndpoint(count, endpoint, PostServicePayload);
  } catch (err) {
    console.log(err);
  }
})();
