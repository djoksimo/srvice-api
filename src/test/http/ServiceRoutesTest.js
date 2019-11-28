const assert = require("assert");
const chaiHttp = require("chai-http");
const mongodb = require("mongodb");
const chai = require("chai");
const { describe } = require("mocha");

const { ServiceModel } = require("../../models/");

const FAKE_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhaW1AY3JlZHVwLnJ1IiwiaWF0IjoxNTcwMTUxMTEyfQ.CyYwspIRCudpljDo7QLawom6AKizB-lYo8cj9VxrfMw";

chai.use(chaiHttp);

class ServiceRoutesTest {
  
  async start() {
    this.testPostService();
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
          .send(mockService)
          .end((err, res) => {     
            assert.strictEqual(201, res.status, "Fail: The status should be 201");
            assert.ok(mongodb.ObjectID.isValid(res.body.serviceId), "Fail: MongoDB ID is not valid");
            done();
          });
      });
    });
  }
}

module.exports = ServiceRoutesTest;
