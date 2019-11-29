const { env } = process;

module.exports = {
  PRODUCTION: "PRODUCTION",
  SANDBOX_01: "SANDBOX_01",
  TEST: "TEST",
  getCurrentNodeEnv: () => env.NODE_ENV,
  getGurrentPort: () => env.PORT || "5000",
};
