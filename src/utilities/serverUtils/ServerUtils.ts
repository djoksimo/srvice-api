import { Server } from "net";
import chai from "chai";
import chaiHttp from "chai-http";
import MongoUtils from "./MongoUtils";
import { createServer } from "../../server";

chai.use(chaiHttp);

// Singleton
class ServerUtils {
  server: Server | null = null;

  private static instance: ServerUtils;

  constructor() {
    if (ServerUtils.instance) {
      return ServerUtils.instance;
    }

    ServerUtils.instance = this;
  }

  private startServer = (port: number): Promise<Server> => {
    if (!this.server) {
      this.getServer();
    }

    return new Promise((resolve) => {
      this.server.listen(port, () => {
        resolve(this.server);
      });
    });
  };

  public getServer = (): Server => {
    if (this.server) {
      return this.server;
    }

    this.server = createServer();
    return this.server;
  };

  public closeServer = (onServerClose?: () => void) => {
    if (this.server) {
      this.server.close(() => {
        if (onServerClose) {
          onServerClose();
        }
      });
    }
  };

  private ping = (port: number) => {
    const baseURL = `http://127.0.0.1:${port}`;
    const request = chai.request(this.server).get(baseURL);

    request.end((err) => {
      if (err) {
        console.log("PING failed");
      } else {
        console.log("PING success");
      }
    });
  };

  public startServerWithLocalDb = async (port = 5002, dbName: string) => {
    const mongo = new MongoUtils();
    mongo.createInMemoryDb(dbName);

    try {
      await mongo.connectToDatabase();
      await this.startServer(port);

      this.ping(port);
    } catch (error) {
      console.log(error);
    }
  };
}

export default ServerUtils;
