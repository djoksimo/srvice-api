// const Agent = require("../../models/AgentModel");
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require("../index");
// const describe = require("mocha");

class ServiceManagerTest {
  async start() {
    await this.testCreateService();

    // COPIED OVER FROM PREVIOUS TESTING IN CASE YOU NEED INSPIRATION
    // const should = chai.should();
    //
    // chai.use(chaiHttp);

    // describe('Agent', () => {
    //   beforeEach((done) => {
    //     Agent.remove({}, (err) => {
    //       done();
    //     });
    //   });
    //   describe('/GET/:id agent', () => {
    //     it('it should GET an agent by the given id', (done) => {
    //       const agent = new Agent({
    //         email: "danilo@srvice.ca",
    //         firstName: "Danilo",
    //         lastName: "Joksimovic",
    //         dateJoined: new Date(),
    //         profilePictureUrl: "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
    //         services: [],
    //         location: "134 Columbia St. W",
    //         languages: ["English", "French", "Serbian"],
    //         company: "Srvice",
    //         education: "University of Waterloo, Software Engineering",
    //         certifications: ["Very Good at Coding (with honours)"],
    //       });
    //       agent.save((err, agent) => {
    //         chai.request(server)
    //           .get('/agent/' + agent.id)
    //           .send(agent)
    //           .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('email');
    //             res.body.should.have.property('firstName');
    //             res.body.should.have.property('lastName');
    //             res.body.should.have.property('dateJoined');
    //             res.body.should.have.property('profilePictureUrl');
    //             res.body.should.have.property('services');
    //             res.body.should.have.property('location');
    //             res.body.should.have.property('languages');
    //             res.body.should.have.property('company');
    //             res.body.should.have.property('education');
    //             res.body.should.have.property('certifications');
    //             res.body.should.have.property('_id').eql(agent.id);
    //             done();
    //           });
    //       });
    //     });
    //   });
    // });
  }

  async testCreateService() {
    // add shit here
  }
}

module.exports = ServiceManagerTest;
