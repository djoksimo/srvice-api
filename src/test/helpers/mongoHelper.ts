import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

export const createTestDatabase = () => {
  return new MongoMemoryServer();
};

export const closeDatabase = async (db: MongoMemoryServer) => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await db.stop();
};

export const connectToDatabase = async (db: MongoMemoryServer) => {
  const uri = await db.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

export const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach(async (key) => {
    const collection = collections[key];
    await collection.deleteMany({});
  });
};
