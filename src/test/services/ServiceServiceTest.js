const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const server = require("../../index");
const { ServiceService } = require("../../bottle");
const { ServiceModel } = require("../../models/");

chai.use(chaiHttp);

class ServiceServiceTest {
  constructor() {
    chai.request(server).get("/");
    this.serviceService = ServiceService;
  }
  async start() {
    this.testSaveService();
  }

  testSaveService() {
    beforeEach((done) => {
      ServiceModel.deleteMany({}, (err) => {
        assert.ifError(err);
        done();
      });
    });
    describe("#ServiceService.saveService()", () => {
      it("Should save service correctly", async () => {
        const mockService = new ServiceModel({
          agent: "5cdf5367cbc99526685bd64f",
          category: "5d116f5d4c533b38dab4e0f0",
          title: "GOOOD GOOD Service",
          description: "ASFAS ASF ASF ASF ASF ASF ASF ASF ASF ASFASFASFASFJASF ASFAJSJASFJASJF ASFASFJSAFAS ASF ASFAS F ASF ASFASFASF AFSAS",
          pictureUrls: [
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg"
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
        });

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
}

module.exports = ServiceServiceTest;
