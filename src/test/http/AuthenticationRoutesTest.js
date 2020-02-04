const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { describe } = require("mocha");

const server = require("../../index");

chai.use(chaiHttp);

class AuthenticationRoutesTest {
  constructor() {
    chai.request(server).get("/");
  }

  async start() {
    describe("/auth route tests", () => {
      this.testAdminConfirmAccount();
    });
  }

  testAdminConfirmAccount() {
    describe("/POST auth/admin/confirm", () => {
      it("should fail to confirm an account due to invalid authentication", (done) => {
        const host = "http://localhost:5000";

        const body = {
          email: "mock@email.com",
        };

        const invalidAdminPassword = "bad-password";

        chai
          .request(host)
          .post("/auth/admin/confirm")
          .set("Authorization", invalidAdminPassword)
          .send(body)
          .end((authErr, confirmAccountRes) => {
            assert.ifError(authErr);
            assert.strictEqual(confirmAccountRes.status, 403, "Fail: The status should be 403");
            done();
          });
      });
    });
  }
}

module.exports = AuthenticationRoutesTest;
