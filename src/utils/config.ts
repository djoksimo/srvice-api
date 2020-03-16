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

export const Environment = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  TEST: "test",
  getCurrentNodeEnv: () => env.NODE_ENV,
  getGurrentPort: () => env.PORT || "5000",
};
