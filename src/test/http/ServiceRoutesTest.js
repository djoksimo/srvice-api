const assert = require("assert");
const chaiHttp = require("chai-http");
const mongodb = require("mongodb");
const chai = require("chai");
const { describe } = require("mocha");

const { HealthyService, MockAgentCredentials } = require("../fixtures");
const { ServiceModel } = require("../../models");
const MockGen = require("../../mock/MockGen");
const { HTTPVerbs } = require("../../enums");

chai.use(chaiHttp);

class ServiceRoutesTest {
  constructor() {
    MockGen.startAPI();
  }

  async start() {
    describe("/service route tests", () => {
      this.testPostService();
      this.testGetService();
      this.testGetNearbyServices();
    });
  }

  testPostService() {
    describe("POST /service", () => {
      beforeEach(done => {
        ServiceModel.deleteMany({}, err => {
          assert.ifError(err);
          done();
        });
      });

      it("it should POST a service successfully", done => {
        const host = "http://localhost:5000";

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
    describe("GET /service:id", () => {
      before(done => {
        ServiceModel.deleteMany({}, err => {
          assert.ifError(err);
          done();
        });
      });

      it("it should GET a service by the given id successfully", done => {
        const mockService = new ServiceModel(HealthyService);
        mockService.save((err, service) => {
          assert.ifError(err);
          MockGen.getChaiRequest(`/service/${service.id}`, HTTPVerbs.GET).end((getServiceError, getServiceResult) => {
            assert.ifError(getServiceError);
            Object.keys(HealthyService).forEach(x => {
              if (x in getServiceResult.body) {
                assert.strictEqual(
                  JSON.stringify(getServiceResult.body[x]),
                  JSON.stringify(HealthyService[x]),
                  "Fail: Returned wrong value for " + x,
                );
              } else {
                assert.ok(false, "Fail: " + x + " should be in the body");
              }
            });
            done();
          });
        });
      });
    });
  }

  testGetNearbyServices() {
    describe("GET /service/nearby?", () => {
      before(done => {
        ServiceModel.deleteMany({}, err => {
          assert.ifError(err);
          done();
        });
      });

      it("it should GET all nearby services successfully", done => {
        const mockService = new ServiceModel(HealthyService);
        const nearbyStr = `nearby?categoryId=${mockService.category}&lat=${mockService.latitude}&lng=${mockService.longitude}`;
        mockService.save((err, service) => {
          assert.ifError(err);

          MockGen.getChaiRequest(`/service/${nearbyStr}`, HTTPVerbs.GET).end((getServiceError, getServiceResult) => {
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
          });
        });
      });
    });
  }
}

module.exports = ServiceRoutesTest;
