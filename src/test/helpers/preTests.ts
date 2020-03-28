import { ServerUtils } from "../../utilities/serverUtils";

export const preTests = () => {
  const serverUtils = new ServerUtils();
  serverUtils.startServerWithLocalDb();
};
