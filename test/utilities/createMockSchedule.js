const { HealthySchedule } = require("../fixtures");

const createMockSchedule = (schedule = {}) => ({
  ...HealthySchedule,
  ...schedule,
});

module.exports = createMockSchedule;
