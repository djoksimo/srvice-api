process.env.NODE_ENV = "TEST";

const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");
const mongodb = require("mongodb");

const {
  cradle: { serviceManager },
} = require("../../src/container");
const { ServiceModel } = require("../../src/models");
const { HealthyService } = require("../fixtures");
const { createMockService } = require("../utilities");

chai.use(chaiHttp);

class ServiceManagerTest {
  constructor() {
    this.serviceManager = serviceManager;
  }

  async start() {
    describe("Service Manager tests", () => {
      this.testCreateService();
      this.testGetServiceById();
      this.testGetNearbyServicesByCategoryId();
    });
  }

  testCreateService() {
    describe("#ServiceManager.createService()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      afterEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should create a service and return id", async () => {
        const res = await this.serviceManager.createService(HealthyService);
        assert.strictEqual(res.status, 201, "Fail: Status code should be 201");
        assert.ok(mongodb.ObjectID.isValid(res.json.serviceId), "Fail: MongoDB ID is not valid");
      });

      it("Should fail creating the service and return error", async () => {
        const badMockService = { title: 3 };
        const res = await this.serviceManager.createService(badMockService);

        assert.strictEqual(res.status, 500, "Fail: Status code should be 500");
        assert.strictEqual(res.json.name, "ValidationError", "Fail: Json should return ValidationError");
      });
    });
  }

  testGetServiceById() {
    describe("#ServiceManager.getServiceById()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return service by id", async () => {
        const mockService = createMockService();
        const res = await this.serviceManager.createService(createMockService(mockService));

        const resGetService = await this.serviceManager.getServiceById({ id: res.json.serviceId });

        assert.strictEqual(resGetService.status, 200, "Fail: Status should be 200");
        assert.strictEqual(
          resGetService.json._id.toString(),
          res.json.serviceId.toString(),
          "Fail: Returned incorrect service",
        );

        assert.strictEqual(resGetService.json.title, mockService.title, "Fail: service title is inaccurate");

        const doesAgentHaveServices = resGetService.json.agent.services.length > 0;
        assert.ok(doesAgentHaveServices, "Fail: services not populated correctly");
      });

      it("Should not return any service", async () => {
        const fakeMongoDBId = "5ddf307e8f0dbcf14e40de97";
        const noServiceMessage = "Service not found";
        const resDontGetService = await this.serviceManager.getServiceById({ id: fakeMongoDBId });

        assert.strictEqual(resDontGetService.status, 404, "Fail: Status should be 404");
        assert.strictEqual(resDontGetService.json.message, noServiceMessage, "Fail: Returned incorrect message");
      });

      it("Should return an error", async () => {
        const resGetServiceError = await this.serviceManager.getServiceById({ id: "" });

        assert.strictEqual(resGetServiceError.status, 500, "Fail: Status should be 500");
        const err = resGetServiceError.json;
        assert.ok(err instanceof Error, "Fail: Should return an error");
      });
    });
  }

  testGetNearbyServicesByCategoryId() {
    describe("#ServiceManager.getNearbyServicesByCategoryId()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return all nearby services", async () => {
        const resOne = await this.serviceManager.createService(HealthyService);
        const serviceTwo = HealthyService;
        serviceTwo.averageServiceRating = 5;
        const resTwo = await this.serviceManager.createService(serviceTwo);

        const { category, latitude, longitude } = HealthyService;
        const resGetNearby = await this.serviceManager.getNearbyServicesByCategoryId({
          categoryId: category,
          lat: latitude,
          long: longitude,
        });

        assert.strictEqual(resGetNearby.status, 200, "Fail: Status should be 200");
        assert.strictEqual(
          resGetNearby.json.services[0]._id.toString(),
          resTwo.json.serviceId.toString(),
          "Fail: Highest service rating should be at the start of the list",
        );
        assert.strictEqual(
          resGetNearby.json.services[1]._id.toString(),
          resOne.json.serviceId.toString(),
          "Fail: Lowest service rating should be at the bottom of the list",
        );
      });
    });
  }
}

module.exports = ServiceManagerTest;
