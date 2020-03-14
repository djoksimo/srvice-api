require("dotenv").config();

const { ServiceManagerTest, OfferingManagerTest } = require("./managers");
const { ServiceServiceTest, ScheduleServiceTest } = require("./services");
const { ServiceRoutesTest, OfferingRoutesTest, AuthenticationRoutesTest } = require("./http");
const { Environment } = require("../src/values");

const index = require("../src");

process.env.NODE_ENV = "TEST";

if (Environment.getCurrentNodeEnv() !== Environment.TEST) {
  console.log("YOU TRIED TO USE THE WRONG DB, SHAME ON YOU");
  console.log("Set your NODE_ENV as TEST");
  process.exit(1);
}

index(5001);

const tests = [
  // Service Tests
  new ServiceManagerTest(),
  new ServiceServiceTest(),
  new ServiceRoutesTest(),

  // Offering Tests
  new OfferingManagerTest(),
  new OfferingRoutesTest(),

  // Authentication Tests
  new AuthenticationRoutesTest(),

  // Schedule Tests
  new ScheduleServiceTest(),
];

tests.forEach(async (test) => {
  try {
    await test.start();
  } catch (error) {
    console.log(error);
  }
});
