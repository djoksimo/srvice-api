import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}

dotenv.config({ path });

const { env } = process;

const nodeEnvironments = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  TEST: "test",
};

const getCurrentNodeEnv = () => env.NODE_ENV;

export const Environment = {
  ...nodeEnvironments,
  runningInDev: getCurrentNodeEnv() === nodeEnvironments.DEVELOPMENT,
  runningInProd: getCurrentNodeEnv() === nodeEnvironments.PRODUCTION,
  runningInTest: getCurrentNodeEnv() === nodeEnvironments.TEST,
  getCurrentNodeEnv,
  getGurrentPort: () => env.PORT ?? "5000",
};
