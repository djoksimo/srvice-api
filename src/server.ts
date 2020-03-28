import fetch from "node-fetch";

import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import http from "http";

import morgan from "morgan";

import {
  AuthenticationRoutes,
  AgentRoutes,
  UserRoutes,
  CategoryRoutes,
  ServiceRoutes,
  RequestRoutes,
  BookingRoutes,
  ServiceRatingRoutes,
  AdminRoutes,
  OfferingRoutes,
  FileRoutes,
  ScheduleRoutes,
  ChatRoutes,
} from "./routes";
import { Environment } from "./utilities";
import { Warning } from "./values";

(global as any).fetch = fetch;

const env = Environment.getCurrentNodeEnv();

// TODO clean this up - move to other file
switch (env) {
  case Environment.DEVELOPMENT:
    Warning.print().currentDB();
    mongoose
      .connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    break;
  case Environment.PRODUCTION:
    Warning.print().currentDB();
    mongoose
      .connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    break;
  case Environment.TEST:
    Warning.print().currentDB();
    break;
  default:
    Warning.print().unspecifiedDB();
}

const app = express();

app.use(helmet());
app.use(compression());
app.set("view engine", "jade");

if (Environment.runningInDev) {
  app.use(morgan("dev"));
} else if (Environment.runningInProd) {
  app.use(morgan("combined"));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/auth", AuthenticationRoutes);
app.use("/agent", AgentRoutes);
app.use("/user", UserRoutes);
app.use("/category", CategoryRoutes);
app.use("/service", ServiceRoutes);
app.use("/admin", AdminRoutes);
app.use("/service-rating", ServiceRatingRoutes);
app.use("/request", RequestRoutes);
app.use("/booking", BookingRoutes);
app.use("/offering", OfferingRoutes);
app.use("/schedule", ScheduleRoutes);
app.use("/file", FileRoutes);
app.use("/chat", ChatRoutes);

app.use((_req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Route not found");
  res.status(404);
  next(error);
});

app.use((err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.render("error", { error: err });
  next();
});

export const createServer = () => http.createServer(app);

export const startServer = (port?: number) => {
  const defaultPort = port || Environment.getGurrentPort();

  app.set("port", defaultPort);
  const server = createServer();

  server.listen(defaultPort, () => console.log(`Srvice REST API listening on port: ${defaultPort}`));
};
