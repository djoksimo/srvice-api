const assert = require("assert");
const chaiHttp = require("chai-http");
const mongodb = require("mongodb");
const chai = require("chai");
const server = require("../../index");
const { describe } = require("mocha");
const { HealthyService } = require("../fixtures/");
const { ServiceModel } = require("../../models/");
const { ServiceService } = require("../../bottle");

const FAKE_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaW1AY3JlZHVwLnJ1IiwiaWF0IjoxNTcwMTUxMTEyfQ.CyYwspIRCudpljDo7QLawom6AKizB-lYo8cj9VxrfMw";

chai.use(chaiHttp);

class ServiceRoutesTest {
  constructor() {
    chai.request(server).get("/");
    this.serviceService = ServiceService;
  }

  async start() {
    this.testPostService();
    this.testGetService();
  }

  testPostService() {
    beforeEach((done) => {
      ServiceModel.deleteMany({}, (err) => {
        assert.ifError(err);
        done();
      });
    });

    describe("/POST service", () => {
      it("it should  POST a service", (done) => {
        const host = "http://localhost:5000";
        chai.request(host)
          .post('/service')
          .set("content-type", "application/json")
          .set("token", FAKE_JWT_TOKEN)
          .set("agentId", "5d969ab55e22efb586ab605f")
          .set("email", "haim@credup.ru")
          .send(HealthyService)
          .end((err, res) => {     
            assert.strictEqual(201, res.status, "Fail: The status should be 201");
            assert.ok(mongodb.ObjectID.isValid(res.body.serviceId), "Fail: MongoDB ID is not valid");
            done();
          });
      });
    });
  }

  testGetService() {
    beforeEach((done) => {
      ServiceModel.deleteMany({}, (err) => {
        assert.ifError(err);
        done();
      });
    });

    describe('/GET service', () => {
      it('it should GET a service by the given id', (done) => {
        const mockService = new ServiceModel(HealthyService);
        mockService.save((err, service) => {
          chai.request(server)
            .get('/service/' + service.id)
            .send(service)
            .end((err2, res) => {
              Object.keys(HealthyService).forEach((x) => {
                if (x in res.body) {
                  assert.strictEqual(JSON.stringify(res.body[x]), JSON.stringify(HealthyService[x]), "Fail: Returned wrong value for " + x);
                } else {
                  assert.ok(false, "Fail: " + x + " should be in the body");
                }
              });
              done();
            });
        });
      });

      it('it should GET all nearby services', (done) => {
        const mockService = new ServiceModel(HealthyService);
        const nearbyStr = "nearby?categoryId=" + mockService.category + "&lat=" + mockService.latitude + "&lng=" + mockService.longitude;
        mockService.save((err, service) => {
          chai.request(server)
            .get('/service/' + nearbyStr)
            .send(service)
            .end((err2, res) => {
              if (res.body.services.length !== 0) {
                assert.strictEqual(res.body.services[0].agent._id.toString(), service.agent.toString(), "Fail: Incorrect agent id returned");
                assert.strictEqual(res.body.services[0].category._id.toString(), service.category.toString(), "Fail: Incorrect category id returned");
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
