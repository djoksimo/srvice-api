const assert = require("assert");
const chaiHttp = require("chai-http");
const mongodb = require("mongodb");
const chai = require("chai");
const { describe } = require("mocha");

const { HealthyService, MockAgentCredentials } = require("../fixtures");
const { ServiceModel } = require("../../src/models");
const MockGen = require("../../mock/MockGen");
const { HTTPVerbs } = require("../../src/enums");

chai.use(chaiHttp);

class ServiceRoutesTest {
  async start() {
    describe("/service route tests", () => {
      this.testPostService();
      this.testGetService();
      this.testGetNearbyServices();
    });
  }

  testPostService() {
    describe("POST /service", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("it should POST a service successfully", (done) => {
        const host = "http://localhost:5001";

        MockGen.getChaiRequest("/service", HTTPVerbs.POST, host, MockAgentCredentials, HealthyService).end(
          (err, res) => {
            assert.ifError(err);
            assert.strictEqual(res.status, 201, "Fail: The status should be 201");
            assert.ok(mongodb.ObjectID.isValid(res.body.serviceId), "Fail: MongoDB ID is not valid");
            done();
          },
        );
      });
    });
  }

  testGetService() {
    const host = "http://localhost:5001";

    describe("GET /service:id", () => {
      before((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("it should GET a service by the given id successfully", (done) => {
        const mockService = new ServiceModel(HealthyService);
        mockService.save((err, service) => {
          assert.ifError(err);
          MockGen.getChaiRequest(`/service/${service.id}`, HTTPVerbs.GET, host).end(
            (getServiceError, getServiceResult) => {
              assert.ifError(getServiceError);
              assert.ok(getServiceResult);
              done();
            },
          );
        });
      });
    });
  }

  testGetNearbyServices() {
    const host = "http://localhost:5001";

    describe("GET /service/nearby?", () => {
      before((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("it should GET all nearby services successfully", (done) => {
        const mockService = new ServiceModel(HealthyService);
        const nearbyStr = `nearby?categoryId=${mockService.category}&lat=${mockService.latitude}&lng=${mockService.longitude}`;
        mockService.save((err, service) => {
          assert.ifError(err);

          MockGen.getChaiRequest(`/service/${nearbyStr}`, HTTPVerbs.GET, host).end(
            (getServiceError, getServiceResult) => {
              assert.ifError(getServiceError);

              if (getServiceResult.body.services.length !== 0) {
                assert.strictEqual(
                  getServiceResult.body.services[0].agent._id.toString(),
                  service.agent.toString(),
                  "Fail: Incorrect agent id returned",
                );
                assert.strictEqual(
                  getServiceResult.body.services[0].category._id.toString(),
                  service.category.toString(),
                  "Fail: Incorrect category id returned",
                );
              } else {
                assert.ok(false, "Fail: Should return a list of services - no service returned");
              }
              done();
            },
          );
        });
      });
    });
  }
}

module.exports = ServiceRoutesTest;
