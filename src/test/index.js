const { ServiceManagerTest } = require("./managers");
const { ServiceServiceTest } = require("./services");

process.env.NODE_ENV = "TEST";

const tests = [
  new ServiceManagerTest(),
  new ServiceServiceTest(),
];


tests.forEach(async (test) => {
  try {
    await test.start();
  } catch (error) {
    console.log(error);
  }
});
