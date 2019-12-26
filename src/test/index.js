require("dotenv").config();

const { ServiceManagerTest } = require("./managers");
const { ServiceServiceTest } = require("./services");
const { ServiceRoutesTest } = require("./http");
const { Environment } = require("../values");

if (Environment.getCurrentNodeEnv() !== Environment.TEST) {
  console.log("YOU TRIED TO USE THE WRONG DB, SHAME ON YOU");
  console.log("Set your NODE_ENV as TEST");
  process.exit(1);
}

const tests = [
  new ServiceManagerTest(),
  new ServiceServiceTest(),
  new ServiceRoutesTest(),
];

tests.forEach(async (test) => {
  try {
    await test.start();
  } catch (error) {
    console.log(error);
  }
});
