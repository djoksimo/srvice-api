const sinon = require("sinon");

class TestUtils {
  // typeOfLog can be "log", "info", "warn" or "error")
  static disableLogs(typeOfLog) {
    sinon.stub(console, typeOfLog); // disable console.<typeOfLog>
  }
}

module.exports = TestUtils;
