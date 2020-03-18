import { AddressInfo } from "net";
import chai from "chai";
import chaiHttp from "chai-http";
import { configureContainer } from "../../container";
import { server as createrServer } from "../../index";
import { closeDatabase, clearDatabase, connectToDatabase, createTestDatabase } from "./mongoHelper";

chai.use(chaiHttp);

const container = configureContainer();

let server = null;
let inMemoryDB = null;

const getServer = () => {
  if (server) return server;

  server = createrServer();

  return new Promise((resolve) => {
    const port = 5002;
    server.listen(port, () => {
      resolve(server);
    });
  });
};

async function apiHelper() {
  if (!inMemoryDB) {
    inMemoryDB = createTestDatabase();
  } else {
    return null;
  }

  return connectToDatabase(inMemoryDB)
    .then(async () => {
      const testServer = await getServer();

      const testPort = (testServer.address() as AddressInfo).port;
      const baseURL = `http://127.0.0.1:${testPort}`;

      const request = chai.request(server).get(baseURL);

      request.end((err) => {
        if (err) {
          console.log("PING failed");
        } else {
          console.log("PING SUCCESS");
        }
      });
    })
    .catch((error) => console.log(error));
}

beforeAll(async () => {
  await apiHelper();
});

afterAll(async () => {
  server = await getServer();

  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        resolve(Promise.all([container.dispose(), closeDatabase(inMemoryDB)]));
      });
    }
  });
});

afterEach(() => {
  return clearDatabase();
});

export function getDependency(dependencyName: string) {
  return container.cradle[dependencyName];
}
