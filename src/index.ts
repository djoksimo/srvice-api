import fetch from "node-fetch";

import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import pino from "express-pino-logger";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

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
import { Environment, createServer } from "./utils";
import { Warning } from "./values";

(global as any).fetch = fetch;

pino();

const env = Environment.getCurrentNodeEnv();

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
    mongoose
      .connect(
        "mongodb+srv://danilo-admin:Password123@srvice-cluster-xxb6t.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
      )
      .catch((error) => console.log(error));
    break;
  default:
    Warning.print().unspecifiedDB();
}

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

const allowedOrigins = [
  "https://srvice.ca",
  "https://app.srvice.ca",
  "https://api.srvice.ca",
  "https://demo.srvice.ca",
];

if (Environment.runningInDev) {
  allowedOrigins.push("http://localhost:3000");
}

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (env === Environment.PRODUCTION) {
  app.use(pino);
}

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

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.render("error", { error: err });
  next();
});

const defaultPort = Environment.getGurrentPort();

if (Environment.getCurrentNodeEnv() !== Environment.TEST) {
  app.set("port", defaultPort);
  createServer(app, defaultPort);
}

export const index = (customPort = defaultPort) => createServer(app, customPort);
