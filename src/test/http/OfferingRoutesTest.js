const assert = require("assert");
const chaiHttp = require("chai-http");
const mongodb = require("mongodb");
const chai = require("chai");
const { describe } = require("mocha");

const server = require("../../index");
const { HealthyService, MockAgentCredentials, HealthyOffering } = require("../fixtures/");
const { ServiceModel, OfferingModel } = require("../../models/");
const MockGen = require("../../mock/MockGen");
const { HTTPVerbs } = require("../../enums");

chai.use(chaiHttp);

class OfferingRoutesTest {
  constructor() {
    chai.request(server).get("/");
  }

  async start() {
    describe("/offering route tests", () => {
      this.testPostOffering();
      this.testPatchOffering();
    });
  }

  testPostOffering() {
    before(done => {
      ServiceModel.deleteMany({}, err => {
        assert.ifError(err);
      });

      OfferingModel.deleteMany({}, err => {
        assert.ifError(err);
        done();
      });
    });

    describe("/POST offering", () => {
      it("it should POST an offering successfully", done => {
        const host = "http://localhost:5000";

        // generate service and attach service ID
        MockGen.getChaiRequest("/service", HTTPVerbs.POST, host, MockAgentCredentials, HealthyService).end(
          (serviceErr, serviceRes) => {
            assert.ifError(serviceErr);
            const { serviceId } = serviceRes.body;

            const mockPostOfferingBody = HealthyOffering;

            mockPostOfferingBody.serviceId = serviceId;

            MockGen.getChaiRequest("/offering", HTTPVerbs.POST, host, MockAgentCredentials, mockPostOfferingBody).end(
              (offeringErr, offeringRes) => {
                assert.ifError(offeringErr);
                assert.strictEqual(offeringRes.status, 201, "Fail: The status should be 201");
                assert.ok(mongodb.ObjectID.isValid(offeringRes.body.offeringId), "Fail: MongoDB ID is not valid");
                done();
              },
            );
          },
        );
      });
    });
  }

  testPatchOffering() {
    before(done => {
      ServiceModel.deleteMany({}, err => {
        assert.ifError(err);
      });

      OfferingModel.deleteMany({}, err => {
        assert.ifError(err);
        done();
      });
    });

    describe("/PATCH offering", () => {
      it("it should PATCH an offering successfully", done => {
        const host = "http://localhost:5000";

        // generate service and attach service ID
        MockGen.getChaiRequest("/service", HTTPVerbs.POST, host, MockAgentCredentials, HealthyService).end(
          (serviceErr, serviceRes) => {
            assert.ifError(serviceErr);
            const { serviceId } = serviceRes.body;

            const mockPostOfferingBody = HealthyOffering;

            mockPostOfferingBody.serviceId = serviceId;

            MockGen.getChaiRequest("/offering", HTTPVerbs.POST, host, MockAgentCredentials, mockPostOfferingBody).end(
              (postOfferingErr, postOfferingRes) => {
                assert.ifError(postOfferingErr);

                const { offeringId } = postOfferingRes.body;

                const patchOfferingBody = {
                  _id: offeringId,
                  title: "New Title",
                };

                MockGen.getChaiRequest("/offering", HTTPVerbs.PATCH, host, MockAgentCredentials, patchOfferingBody).end(
                  (patchOfferingError, patchOfferingRes) => {
                    assert.ifError(patchOfferingError);
                    assert.strictEqual(200, patchOfferingRes.status, "Fail: The status should be 200");

                    done();
                  },
                );
              },
            );
          },
        );
      });
    });
  }
}

module.exports = OfferingRoutesTest;
