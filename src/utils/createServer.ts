import { Express } from "express";
import http from "http";

export const createServer = (app: Express) => {
  const server = http.createServer(app);

  return server;
};
