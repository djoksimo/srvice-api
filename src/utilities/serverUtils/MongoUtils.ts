import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

// Singleton
class MongoUtils {
  db: null | MongoMemoryServer;

  private static instance: MongoUtils;

  constructor() {
    if (MongoUtils.instance) {
      return MongoUtils.instance;
    }

    MongoUtils.instance = this;
  }

  public createInMemoryDb = () => {
    if (!this.db) {
      this.db = new MongoMemoryServer();
    }
    return this.db;
  };

  public getDb = () => {
    if (!this.db) {
      console.error("No active active database");
    }
    return this.db;
  };

  public closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.db.stop();
  };

  public connectToDatabase = async () => {
    const uri = await this.db.getConnectionString();

    const mongooseOpts = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };

    return mongoose.connect(uri, mongooseOpts).catch((error) => console.log(error));
  };

  static clearDatabase = async () => {
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(async (key) => {
      const collection = collections[key];
      await collection.deleteMany({});
    });
  };
}

export default MongoUtils;
