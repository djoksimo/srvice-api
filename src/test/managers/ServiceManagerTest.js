const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const mongodb = require("mongodb");

const server = require("../../index");
const { ServiceManager } = require("../../bottle");
const { ServiceModel } = require("../../models/");
const { HealthyService } = require("../fixtures/");

chai.use(chaiHttp);

class ServiceManagerTest {
  constructor() {
    chai.request(server).get("/");
    this.serviceManager = ServiceManager;
  }

  async start() {
    this.testCreateService();
    this.testGetService();
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
        const res = await this.serviceManager.createService(HealthyService);
        assert.strictEqual(res.status,201,"Fail: Status code should be 201");
        assert.ok(mongodb.ObjectID.isValid(res.json.serviceId), "Fail: MongoDB ID is not valid");
      });

      it("Should fail creating the service and return error", async () => {
        const badMockService = new ServiceModel({});
        const res = await this.serviceManager.createService(badMockService);
        
        assert.strictEqual(res.status, 500,"Fail: Status code should be 500");
        assert.strictEqual(res.json.name, "ValidationError","Fail: Json should return ValidationError");
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

    describe("#ServiceManager.getNearbyServicesByCategoryId()", () => {
      it("Should return all nearby services", async () => {
        const resOne = await this.serviceManager.createService(HealthyService);
        const serviceTwo = HealthyService;
        serviceTwo.averageServiceRating = 5;
        const resTwo = await this.serviceManager.createService(serviceTwo);
        
        const cat = HealthyService.category;
        const latitude =  HealthyService.latitude;
        const longitude = HealthyService.longitude;
        const resGetNearby = await this.serviceManager.getNearbyServicesByCategoryId({categoryId: cat,lat: latitude,long: longitude});
        
        assert.strictEqual(resGetNearby.status,200,"Fail: Status should be 200");
        assert.strictEqual(resGetNearby.json.services[0]._id.toString(),resTwo.json.serviceId.toString(),"Fail: Highest service rating should be at the start of the list");
        assert.strictEqual(resGetNearby.json.services[1]._id.toString(),resOne.json.serviceId.toString(),"Fail: Lowest service rating should be at the bottom of the list");
      });
    });

    describe("#ServiceManager.getServiceById()", () => {
      it("Should return service by id", async () =>{
        const res = await this.serviceManager.createService(HealthyService);
        const resGetService = await this.serviceManager.getServiceById({id: res.json.serviceId});

        assert.strictEqual(resGetService.status,200,"Fail: Status should be 200");
        assert.strictEqual(resGetService.json._id.toString(),res.json.serviceId.toString(),"Fail: Returned incorrect service");
        for (var x in HealthyService){
          if (x in resGetService.json){
            assert.strictEqual(JSON.stringify(resGetService.json[x]),JSON.stringify(HealthyService[x]),"Fail: Returned wrong value for " + x);
          }else{
            assert.ok(false,"Fail: " + x + " should be in the body");
          }
        }
      });

      it("Should not return any service", async () =>{
        const fakeMongoDBId = "5ddf307e8f0dbcf14e40de97";
        const noServiceMessage = "Service not found";
        const resDontGetService = await this.serviceManager.getServiceById({id: fakeMongoDBId});

        assert.strictEqual(resDontGetService.status,404,"Fail: Status should be 404");
        assert.strictEqual(resDontGetService.json.message,noServiceMessage,"Fail: Returned incorrect message");
      });

      it("Should return an error", async () =>{
        const resGetServiceError = await this.serviceManager.getServiceById({id: ""});

        assert.strictEqual(resGetServiceError.status,500,"Fail: Status should be 500");
        try {
          resGetServiceError.json;
          assert.ok(false,"Fail: Should return an error");
        }catch (error){
          assert.ok(true);
        }
      });

    });   
  }

}

 module.exports = ServiceManagerTest;

