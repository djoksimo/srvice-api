const { HealthyService } = require("../fixtures");

const createMockService = (service = {}) => ({
  ...HealthyService,
  ...service,
});

module.exports = createMockService;
