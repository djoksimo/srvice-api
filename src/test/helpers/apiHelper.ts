import { AddressInfo, Server } from "net";
import chai from "chai";
import chaiHttp from "chai-http";
import { configureContainer } from "../../container";
import { server as createrServer } from "../../index";
import { closeDatabase, clearDatabase, connectToDatabase, createTestDatabase } from "./mongoHelper";
import { getServer, apiHelper } from "../../utils";

beforeAll(async () => {
  await apiHelper();
});

afterAll(async () => {
  return new Promise((resolve) => {
    const server = await getServer();

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
