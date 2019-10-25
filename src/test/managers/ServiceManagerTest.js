const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const mongodb = require("mongodb");

const server = require("../../index");
const { ServiceManager } = require("../../bottle");
const { ServiceModel } = require("../../models/");
const { HealthyService } = require("../fixtures/");

chai.use(chaiHttp);

class ServiceManagerTest {
  constructor() {
    chai.request(server).get("/");
    this.serviceManager = ServiceManager;
  }

  async start() {
    this.testCreateService();
  }

  testCreateService() {
    beforeEach((done) => {
      ServiceModel.deleteMany({}, (err) => {
        assert.ifError(err);
        done();
      });
    });

    describe("#ServiceManager.createService()", () => {
      it("Should create a service and return id", async () => {
        const res = await this.serviceManager.createService(HealthyService);
        assert.strictEqual(201, res.status, "Fail: Status code should be 201");
        assert.ok(mongodb.ObjectID.isValid(res.json.serviceId), "Fail: MongoDB ID is not valid");
      });

      it("Should fail creating the service and return error", async () => {
        const badMockService = new ServiceModel({});
        const res = await this.serviceManager.createService(badMockService);
        
        assert.strictEqual(500, res.status, "Fail: Status code should be 500");
        assert.strictEqual("ValidationError", res.json.name, "Fail: Json should return ValidationError");
      });    
    });
  }
}

module.exports = ServiceManagerTest;

