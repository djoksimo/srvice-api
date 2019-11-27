const { env } = process;

class Environment {
  static PRODUCTION = "PRODUCTION";
  static SANDBOX_01 = "SANDBOX_01";
  static TEST = "TEST";

  static getCurrentNodeEnv() {
    return env.NODE_ENV;
  }

  static getGurrentPort() {
    return env.PORT || "5000";
  }
}

module.exports = Environment;
