process.env.NODE_ENV = "TEST";

const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");
const mongodb = require("mongodb");

const server = require("../../index");
const { OfferingManager, ServiceManager } = require("../../bottle");
const { OfferingModel, ServiceModel } = require("../../models/");
const { HealthyOffering, HealthyService, MockAgentCredentials } = require("../fixtures/");
const TestUtils = require("../TestUtils");

chai.use(chaiHttp);

class OfferingManagerTest {
  constructor() {
    chai.request(server).get("/");
    this.offeringManager = OfferingManager;
    this.serviceManager = ServiceManager;
  }

  async start() {
    describe("OfferingManager Tests", () => {
      this.testCreateOffering();
      this.testDeleteOffering();
      this.testPatchOffering();
    });
  }

  testCreateOffering() {
    describe("#OfferingManager.createOffering()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (serviceError) => {
          assert.ifError(serviceError);

          OfferingModel.deleteMany({}, (offeringError) => {
            assert.ifError(offeringError);
            done();
          });
        });
      });

      afterEach((done) => {
        ServiceModel.deleteMany({}, (serviceError) => {
          assert.ifError(serviceError);

          OfferingModel.deleteMany({}, (offeringError) => {
            assert.ifError(offeringError);
            done();
          });
        });
      });

      it("Should create an offering and return id", async () => {
        // TODO: make this test independent of this.serviceManager.createService(HealthyService);
        // by replacing with mock generation tool
        const serviceRes = await this.serviceManager.createService(HealthyService);

        // attach serviceId to offering
        const offeringBody = HealthyOffering;
        offeringBody.serviceId = serviceRes.json.serviceId;

        const res = await this.offeringManager.createOffering(offeringBody, MockAgentCredentials);

        assert.strictEqual(res.status, 201, "Fail: Status code should be 201");
        assert.ok(mongodb.ObjectID.isValid(res.json.offeringId), "Fail: Offering ID is not valid");
      });

      it("Should fail creating the offering without serviceId and return an error", async () => {
        TestUtils.disableLogs("log");

        const badOfferingBody = HealthyOffering;
        const res = await this.offeringManager.createOffering(badOfferingBody, MockAgentCredentials);

        assert.strictEqual(res.status, 500, "Fail: Status code should be 500");
        assert.strictEqual(
          res.json.message,
          "Could not find service",
          // eslint-disable-next-line quotes
          'Fail: should return "Could not find service" issue',
        );
      });

      it("Should fail creating the offering without credentials and return an error", async () => {
        TestUtils.disableLogs("error");

        // TODO: make this test independent of this.serviceManager.createService(HealthyService);
        // by replacing with mock generation tool
        const serviceRes = await this.serviceManager.createService(HealthyService);

        // attach serviceId to offering
        const offeringBody = HealthyOffering;
        offeringBody.serviceId = serviceRes.json.serviceId;

        const res = await this.offeringManager.createOffering(offeringBody, {}); // without authHeader credentials

        assert.strictEqual(res.status, 500, "Fail: Status code should be 500");
        assert.strictEqual(res.json.message, "NICE TRY ;)", "Fail: call should return authorization error");
      });
    });
  }

  testPatchOffering() {
    describe("#OfferingManager.patchOffering()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
        });

        OfferingModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      afterEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
        });

        OfferingModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should patch an offering successfully", async () => {
        // TODO: make this test more independent of ServiceManager and other methods
        const serviceRes = await this.serviceManager.createService(HealthyService);
        const { serviceId } = serviceRes.json;

        // attach serviceId to offering
        const offeringBody = HealthyOffering;
        offeringBody.serviceId = serviceId;

        const createRes = await this.offeringManager.createOffering(offeringBody, MockAgentCredentials);

        const { offeringId } = createRes.json;

        const patchBody = {
          _id: offeringId,
          title: "New Title",
        };

        const patchOfferingRes = await this.offeringManager.patchOffering(patchBody, MockAgentCredentials);
        assert.strictEqual(patchOfferingRes.status, 200, "Fail: Status code should be 200");

        const findOfferingResult = await OfferingModel.findById(offeringId).exec();

        assert.strictEqual(
          findOfferingResult.title,
          patchBody.title,
          `Fail: title should have been modified to "${patchBody.title}`,
        );
      });
    });
  }

  testDeleteOffering() {
    describe("#OfferingManager.deleteOffering()", () => {
      beforeEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
        });

        OfferingModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      afterEach((done) => {
        ServiceModel.deleteMany({}, (err) => {
          assert.ifError(err);
        });

        OfferingModel.deleteMany({}, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it("Should delete an offering successfully", async () => {
        // TODO: make this test more independent of ServiceManager
        const serviceRes = await this.serviceManager.createService(HealthyService);
        const { serviceId } = serviceRes.json;

        // attach serviceId to offering
        const offeringBody = HealthyOffering;
        offeringBody.serviceId = serviceId;

        const createRes = await this.offeringManager.createOffering(offeringBody, MockAgentCredentials);

        const { offeringId } = createRes.json;

        const deleteRes = await this.offeringManager.deleteOffering(
          {
            offeringId,
            serviceId,
          },
          MockAgentCredentials,
        );

        assert.strictEqual(deleteRes.status, 200, "Fail: Status code should be 200");
        // TODO: add search for offering in service
        // and check if offering is accessible
      });
    });
  }
}

module.exports = OfferingManagerTest;
