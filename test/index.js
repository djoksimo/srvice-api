import { ServiceManagerTest, OfferingManagerTest } from "./managers";
import { ServiceServiceTest, ScheduleServiceTest } from "./services";
import { ServiceRoutesTest, OfferingRoutesTest, AuthenticationRoutesTest } from "./http";
import { Environment } from "../src/utils";

import index from "../src";

process.env.NODE_ENV = Environment.TEST;

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
