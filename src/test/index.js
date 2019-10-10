const { ServiceManagerTest } = require("./managers");
const { ServiceServiceTest } = require("./services");
const { ServiceRoutesTest } = require("./http");

process.env.NODE_ENV = "TEST";

const tests = [
  new ServiceManagerTest(),
  new ServiceServiceTest(),
  new ServiceRoutesTest(),
];


tests.forEach(async (test) => {
  try {
    if (process.env.NODE_ENV === "TEST") {
      await test.start();
    } else {
      console.log("YOU TRIED TO USE THE WRONG DB, SHAME ON YOU");
    }
  } catch (error) {
    console.log(error);
  }
});
