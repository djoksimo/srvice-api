import { ServerUtils, MongoUtils } from "../../utilities/serverUtils";
import { configureContainer } from "../../container";

export const postTests = () => {
  const serverUtils = new ServerUtils();
  const container = configureContainer();
  return new Promise((resolve) => {
    serverUtils.getServer();

    serverUtils.closeServer(() => {
      const mongo = new MongoUtils();

      resolve(Promise.all([container.dispose(), mongo.closeDatabase()]));
    });
  });
};
