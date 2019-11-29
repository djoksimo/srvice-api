const chaiHttp = require("chai-http");
const chai = require("chai");
const server = require("../../index");

const FAKE_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vc3NzQGdtYWlsLmNvbSIsImlhdCI6MTU2NDYyMTYyNH0.dAjG8fwnFFXmk6VEVvjcD5fquUrr0-pZQfRzghVFIhQ";
chai.use(chaiHttp);

class MockServiceCreation {
  start() {
    chai.request(server).get("/"); // initialize server
  }

  generateFakeServices(numServices, mockService) {
    const host = "http://localhost:5000";

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numServices; i++) {
      setTimeout(() => { 
        chai.request(host)
          .post('/service')
          .set("content-type", "application/json")
          .set("token", FAKE_JWT_TOKEN)
          .set("agentId", "5cdf5367cbc99526685bd64f")
          .set("email", "mosss@gmail.com")
          .send(mockService)
          .end((err, res) => {  
            if (err) {
              console.log(err);
              return;
            }
            console.log("CREATED SERVICE: ", res.body);
          }, 3000);        
      });
    }
    
  }
}

module.exports = MockServiceCreation;
