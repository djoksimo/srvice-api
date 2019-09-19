// const mongoose = require("mongoose");
// const Service = require("../models/ServiceModel");
// const Agent = require("../models/AgentModel");
// const User = require("../models/UserModel");
// const Category = require("../models/CategoryModel");
// const ServiceRating = require("../models/ServiceRatingModel");
// const chai = require('chai');
// const assert = require('assert');
// const chaiHttp = require('chai-http');
// const server = require("../index");
//
// const should = chai.should();
//
// chai.use(chaiHttp);

class ServiceServiceTest {
  async start() {
    await this.testSaveService();

    // COPIED OVER FROM PREVIOUS TESTING IN CASE YOU NEED INSPIRATION
    // async function createNewService() {
    //   return new Promise((resolve, reject) => {
    //     const agent = new Agent({
    //       email: "danilo@srvice.ca",
    //       firstName: "Danilo",
    //       lastName: "Joksimovic",
    //       dateJoined: new Date(),
    //       profilePictureUrl: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    //       services: [],
    //       location: "134 Columbia St. W",
    //       languages: ["English", "French", "Serbian"],
    //       company: "Srvice",
    //       education: "University of Waterloo, Software Engineering",
    //       certifications: ["Very Good at Coding (with honours)"],
    //     });
    //
    //     const category = new Category({
    //       name: "Car Mechanic",
    //     });
    //
    //     const user = new User({
    //       email: "jon@do.yu",
    //       firstName: "Jon",
    //       lastName: "Do",
    //       dateJoined: new Date(), // use date
    //       profilePictureUrl: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    //     });
    //
    //     user.save((err) => {
    //       if (err) {
    //         console.log(err);
    //       }
    //     });
    //
    //     agent.save((err) => {
    //       if (err) {
    //         console.log(err);
    //       }
    //     });
    //
    //     category.save((err) => {
    //       if (err) {
    //         console.log(err);
    //       }
    //     });
    //
    //     const service = new Service({
    //       agent: agent.id,
    //       category: category.id,
    //       title: "Title",
    //       description: "Description",
    //       pictureUrls: ["https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg"],
    //       phone: "000-000-0000",
    //       email: "hello@world.yu",
    //       inCall: true,
    //       outCall: true,
    //       remoteCall: true,
    //       address: "000 Waterloo St.",
    //       latitude: 0.0,
    //       longitude: 0.0,
    //       radius: 0.0,
    //       rating: 0.0,
    //       ratings: [],
    //     });
    //
    //     const rating = new ServiceRating({
    //       user: user.id,
    //       service: service.id,
    //       rating: 4.5,
    //       comment: "Very good service!",
    //       date: new Date(),
    //     });
    //
    //     rating.save((err) => {
    //       if (err) {
    //         console.log(err);
    //         reject(err);
    //       }
    //     });
    //
    //     service.update({ ratings: [rating.id] });
    //     resolve(service);
    //   });
    // }
    //
    // describe('Service', () => {
    //   beforeEach((done) => {
    //     Service.remove({}, (err) => {
    //       if (err) {
    //         console.log('ERROR removing services ', err);
    //       }
    //       console.log("Service Test: Removed All Services");
    //     });
    //
    //     ServiceRating.remove({}, (err) => {
    //       if (err) {
    //         console.log('ERROR removing service ratings ', err);
    //       }
    //       console.log("Service Test: Removed All Service Ratings");
    //     });
    //
    //     Category.remove({}, (err) => {
    //       if (err) {
    //         console.log('ERROR removing categories ', err);
    //       }
    //       console.log("Service Test: Removed All Categories");
    //     });
    //
    //     Agent.remove({}, (err) => {
    //       if (err) {
    //         console.log('ERROR removing agents ', err);
    //       }
    //       console.log("Service Test: Removed All Agents");
    //     });
    //
    //     done();
    //   });
    //   describe('/GET/:id service', () => {
    //     it('it should GET a service by the given id', async () => {
    //       try {
    //         const service = await createNewService();
    //         service.save((err) => {
    //           chai.request(server)
    //             .get('/service/' + service.id)
    //             .send(service)
    //             .end((error, res) => {
    //               if (err) {
    //                 console.log("error while saving service");
    //               }
    //               res.body = res.body.result;
    //               res.should.have.status(200);
    //               res.body.should.be.a('object');
    //               res.body.should.have.property('agent');
    //               res.body.should.have.property('category');
    //               res.body.should.have.property('title');
    //               res.body.should.have.property('description');
    //               res.body.should.have.property('pictureUrls');
    //               res.body.should.have.property('phone');
    //               res.body.should.have.property('email');
    //               res.body.should.have.property('inCall');
    //               res.body.should.have.property('outCall');
    //               res.body.should.have.property('remoteCall');
    //               res.body.should.have.property('address');
    //               res.body.should.have.property('latitude');
    //               res.body.should.have.property('longitude');
    //               res.body.should.have.property('radius');
    //               res.body.should.have.property('rating');
    //               res.body.should.have.property('ratings');
    //               res.body.should.have.property('_id').eql(service.id);
    //               chai.assert.ok(true);
    //             });
    //         });
    //       } catch (err) {
    //         console.log("Unspecified error: ", err);
    //       }
    //     });
    //   });
    // });
  }

  async testSaveService() {
    // add shit here
  }
}

module.exports = ServiceServiceTest;
