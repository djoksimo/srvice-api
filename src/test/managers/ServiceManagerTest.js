const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const mongodb = require("mongodb");

const server = require("../../index");
const { ServiceManager } = require("../../bottle");
const { ServiceModel } = require("../../models/");

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
        const mockService = {
          agent: "5cdf5367cbc99526685bd64f",
          category: "5d116f5d4c533b38dab4e0f0",
          title: "GOOOD GOOD Service",
          description: "ASFAS ASF ASF ASF ASF ASF ASF ASF ASF ASFASFASFASFJASF ASFAJSJASFJASJF ASFASFJSAFAS ASF ASFAS F ASF ASFASFASF AFSAS",
          pictureUrls: [
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
          ],
          phone: "4161234567",
          email: "mosss@gmail.com",
          inCall: true,
          outCall: true,
          remoteCall: true,
          address: "3530 Atwater Ave, Montreal, QC H3H 1Y5",
          latitude: 50.304922,  
          longitude: -73.589814,
          radius: 10,
          averageServiceRating: 0,
          serviceRatings: [],
          products: [],
        };

        const res = await this.serviceManager.createService(mockService);
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

