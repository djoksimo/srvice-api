process.env.NODE_ENV = "TEST";

module.exports = {
  ServiceRoutesTest: require("./ServiceRoutesTest"),
  OfferingRoutesTest: require("./OfferingRoutesTest"),
  AuthenticationRoutesTest: require("./AuthenticationRoutesTest"),
};
