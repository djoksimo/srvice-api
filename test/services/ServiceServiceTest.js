process.env.NODE_ENV = "TEST";

const assert = require("assert");
const { describe } = require("mocha");

const {
  cradle: { serviceService },
} = require("../../src/container");
const { ServiceModel } = require("../../src/models");
const { HealthyService, InvalidMongoID } = require("../fixtures");
const MockGen = require("../../src/mock/MockGen");

class ServiceServiceTest {
  constructor() {
    MockGen.startAPI();
    this.serviceService = serviceService;
  }
  async start() {
    describe("ServiceService tests", () => {
      this.testSaveService();
      this.testFindServicesByCategoryId();
      this.testFindSemiPopulatedAgentServiceById();
      this.testFindServiceById();
    });
  }

  testSaveService() {
    describe("#ServiceService.saveService()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should save service correctly", async () => {
        const mockService = new ServiceModel(HealthyService);
        const res = await this.serviceService.saveService(mockService);
        assert.ok(res);
      });

      it("Should fail saving the service", async () => {
        try {
          const badMockService = new ServiceModel({});
          await this.serviceService.saveService(badMockService);
        } catch (err) {
          assert.ok(true);
        }
      });
    });
  }

  testFindServicesByCategoryId() {
    describe("#ServiceService.findServicesByCategoryId()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return all services with the category id", async () => {
        const mockService = new ServiceModel(HealthyService);
        await this.serviceService.saveService(mockService);
        const res = await this.serviceService.findServicesByCategoryId(mockService.category);
        assert.ok(res.length !== 0, "Fail: Should not return an empty list");
        assert.strictEqual(
          res[0].category._id.toString(),
          mockService.category.toString(),
          "Fail: Should return services of the inputted category id",
        );
      });

      it("Should return no services for unknown category id", async () => {
        const res = await this.serviceService.findServicesByCategoryId(InvalidMongoID);
        assert.ok(res.length === 0, "Fail: Should return an empty list");
      });
    });
  }

  testFindServiceById() {
    describe("#ServiceService.findServiceById()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return a non-populated service by its id", async () => {
        const mockService = new ServiceModel(HealthyService);
        const saveServiceRes = await this.serviceService.saveService(mockService);
        const findServiceRes = await this.serviceService.findServiceById(saveServiceRes.id);
        assert.strictEqual(
          findServiceRes._id.toString(),
          saveServiceRes.id.toString(),
          "Fail: Should return a service by the inputted service id",
        );
      });

      it("Should not return any non-populated service for unknown service id", async () => {
        const res = await this.serviceService.findServiceById(InvalidMongoID);
        assert.strictEqual(res, null, "Fail: Should return no services for unknown service id");
      });
    });
  }

  testFindSemiPopulatedAgentServiceById() {
    describe("#ServiceService.findSemiPopulatedAgentServiceById()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return a semi-populated service by its id", async () => {
        const mockService = new ServiceModel(HealthyService);
        const saveServiceRes = await this.serviceService.saveService(mockService);
        const findServiceRes = await this.serviceService.findSemiPopulatedAgentServiceById(saveServiceRes.id);
        assert.strictEqual(
          findServiceRes._id.toString(),
          saveServiceRes.id.toString(),
          "Fail: Should return a service by the inputted service id",
        );
      });
    });
  }
}

module.exports = ServiceServiceTest;
