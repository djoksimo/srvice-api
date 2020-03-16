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

export const Environment = {
  ...nodeEnvironments,
  runningInDev: env.NODE === nodeEnvironments.DEVELOPMENT,
  runningInProd: env.NODE === nodeEnvironments.PRODUCTION,
  runningInTest: env.NODE === nodeEnvironments.TEST,
  getCurrentNodeEnv: () => env.NODE_ENV,
  getGurrentPort: () => env.PORT || "5000",
};
