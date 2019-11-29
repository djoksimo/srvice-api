const { MockServiceCreation } = require("./ServiceMock");
const { Environment } = require("../values");
const { PostServicePayload } = require("./fixtures");

const mockServiceCreationClient = new MockServiceCreation();

mockServiceCreationClient.start();

if (Environment.getCurrentNodeEnv() !== Environment.SANDBOX_01) {
  console.log("YOU ARE NOT USING THE SANDBOX DB");
  process.exit(1);
}

mockServiceCreationClient.generateFakeServices(50, PostServicePayload);
