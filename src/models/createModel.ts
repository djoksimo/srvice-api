import { models, model, Schema } from "mongoose";

export const createModel = (modelName: string, schema: Schema) => {
  return models[modelName] ?? model(modelName, schema);
};
