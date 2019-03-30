process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Service = require("../models/ServiceModel");
const Agent = require("../models/AgentModel");
const User = require("../models/UserModel")
const Category = require("../models/CategoryModel");
const ServiceRating = require("../model/ServiceRatingModel");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../index");

const should = chai.should();

chai.use(chaiHttp);



function createNewService(){

  let agent = new Agent({
    email: "danilo@srvice.ca",
    firstName: "Danilo",
    lastName: "Joksimovic",
    dateJoined: new Date(),
    profilePictureUrl: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    services: [],
    location: "134 Columbia St. W",
    languages: ["English", "French", "Serbian"],
    company: "Srvice",
    education: "University of Waterloo, Software Engineering",
    certifications: ["Very Good at Coding (with honours)"],
  });

  let category = new Category({
    name : "Car Mechanic"

  });
  
  let user = new User({
    email: "jon@do.yu",
    firstName: "Jon",
    lastName: "Do",
    dateJoined: new Date(), //use date 
    profilePictureUrl:"https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
  });

  user.save((err) => {
    if (err) {
      console.log(err);
    }
  });

  agent.save((err) => {
    if (err) {
      console.log(err);
    }
  });

  category.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  
  let ratings = new ServiceRating({
    user: user.id,
    service: { type: ObjectId, ref: "Service", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
  });

  let service = new Service({
    agent: agent.id,
    category: category.id,
    title: "Title",
    description: "Description",
    pictureUrls: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    phone: "000-000-0000",
    email: "hello@world.yu",
    inCall: true,
    outCall: true,
    remoteCall: true,
    address: "000 Waterloo St.",
    latitude: 0.0,
    longitude: 0.0,
    radius: 0.0,
    rating: 0.0,
    ratings: [],
  })
}
  

describe('Service', () => {
  beforeEach((done) => {

    Service.remove({}, (err) => {
      done();
      console.log("Service Test: Removed All Services");
    });
    
    Category.remove({}, (err) => {
      done();
      console.log("Service Test: Removed All Categories");
    });

    Agent.remove({}, (err) => {
      done();
      console.log("Service Test: Removed All Agents");
    });

  });
  describe('/GET/:id service', () => {
    it('it should GET a service by the given id', (done) => {
    //   let agent = new Service({
    //     email: "danilo@srvice.ca",
    //     firstName: "Danilo",
    //     lastName: "Joksimovic",
    //     dateJoined: new Date(),
    //     profilePictureUrl: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    //     services: [],
    //     location: "134 Columbia St. W",
    //     languages: ["English", "French", "Serbian"],
    //     company: "Srvice",
    //     education: "University of Waterloo, Software Engineering",
    //     certifications: ["Very Good at Coding (with honours)"],
    //   });
      
      agent.save((err, Service) => {
        chai.request(server)
          .get('/agent/' + service.id)
          .send(service)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('agent');
            res.body.should.have.property('category');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('pictureUrls');
            res.body.should.have.property('phone');
            res.body.should.have.property('email');
            res.body.should.have.property('inCall');
            res.body.should.have.property('outCall');
            res.body.should.have.property('remoteCall');
            res.body.should.have.property('address');
            res.body.should.have.property('latitude');
            res.body.should.have.property('longitude');
            res.body.should.have.property('radius');
            res.body.should.have.property('rating');
            res.body.should.have.property('ratings');
            res.body.should.have.property('_id').eql(service.id);
            done();
          });
      });
    });
  });
});
