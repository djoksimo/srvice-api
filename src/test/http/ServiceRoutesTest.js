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
        // TODO: temporarily put here as Filip's changes are in review
        const mockService = {
          agent: "5d969ab55e22efb586ab605f",
          category: "5d969ec1365ddec148ee5b0b",
          title: "GOOOD GOOD Service",
          description: "ASFAS ASF ASF ASF ASF ASF ASF ASF ASF ASFASFASFASFJASF ASFAJSJASFJASJF ASFASFJSAFAS ASF ASFAS F ASF ASFASFASF AFSAS",
          pictureUrls: [
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
            "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/baby_ja7a.svg",
          ],
          phone: "4161234567",
          email: "haim@credup.ru",
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
