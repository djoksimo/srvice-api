import { ServerUtils } from "../../utilities/serverUtils";

export const preTests = () => {
  const serverUtils = new ServerUtils();
  serverUtils.startServerWithLocalDb(5002, "test-db");
};
