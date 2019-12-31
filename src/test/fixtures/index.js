process.env.NODE_ENV = "TEST";
process.env.NODE_ENV = "TEST";

module.exports = {
  HealthyService: require("./HealthyService"),
  HealthyOffering: require("./HealthyOffering"),
  MockAgentCredentials: require("./MockAgentCredentials"),
};
