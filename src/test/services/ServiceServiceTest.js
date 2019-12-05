const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const server = require("../../index");
const { ServiceService } = require("../../bottle");
const { ServiceModel } = require("../../models/");
const { HealthyService } = require("../fixtures/");

const fakeMongoID = "5da9032e059b1ff6fdf43e13";
chai.use(chaiHttp);

class ServiceServiceTest {
  constructor() {
    chai.request(server).get("/");
    this.serviceService = ServiceService;
  }
  async start() {
    this.testSaveService();
    this.testFindService();
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

  testFindService() {

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
        assert.strictEqual(res[0].category._id.toString(), mockService.category.toString(), "Fail: Should return services of the inputted category id");
      });

      it("Should return no services for unknown category id", async () => {
        const res = await this.serviceService.findServicesByCategoryId(fakeMongoID);
        assert.ok(res.length === 0, "Fail: Should return an empty list");
      });
    });

    describe("#ServiceService.findSemiPopulatedAgentServiceById()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return a service by its id", async () => { 
        const mockService = new ServiceModel(HealthyService);
        const res = await this.serviceService.saveService(mockService);
        const res2 = await this.serviceService.findSemiPopulatedAgentServiceById(res.id);
        assert.strictEqual(res2._id.toString(), res.id.toString(), "Fail: Should return a service by the inputted service id");
      });

      it("Should not return any service for unknown service id", async () => {
        const res = await this.serviceService.findServiceById(fakeMongoID);
        assert.strictEqual(res, null, "Fail: Should return no services for unknown service id");
      });

    });

    describe("#ServiceService.findServiceById()", () => {  
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should return a service by its id", async () => { 
        const mockService = new ServiceModel(HealthyService);
        const res = await this.serviceService.saveService(mockService);
        const res2 = await this.serviceService.findServiceById(res.id);
        assert.strictEqual(res2._id.toString(), res.id.toString(), "Fail: Should return a service by the inputted service id");
      });

      it("Should not return any service for unknown service id", async () => {
        const res = await this.serviceService.findServiceById(fakeMongoID);
        assert.strictEqual(res, null, "Fail: Should return no services for unknown service id");
      });
    });
  
  }

}

module.exports = ServiceServiceTest;
