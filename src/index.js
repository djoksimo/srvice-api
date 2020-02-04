global.fetch = require("node-fetch");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const pino = require("express-pino-logger")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

require("dotenv").config();

const {
  AuthenticationRoutes,
  AgentRoutes,
  UserRoutes,
  CategoryRoutes,
  ServiceRoutes,
  RequestRoutes,
  BookingRoutes,
  ServiceRatingRoutes,
  AdminRoutes,
  SendRoutes,
  OfferingRoutes,
  FileRoutes,
  ScheduleRoutes,
  ChatRoutes,
} = require("./routes");
const { Environment, Warning } = require("./values");

const env = Environment.getCurrentNodeEnv();

switch (env) {
  case Environment.SANDBOX_01:
    Warning.print().currentDB();
    mongoose
      .connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", {
        useNewUrlParser: true,
        useFindAndModify: false,
      })
      .catch(error => console.log(error));
    break;
  case Environment.PRODUCTION:
    Warning.print().currentDB();
    mongoose
      .connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", {
        useNewUrlParser: true,
        useFindAndModify: false,
      })
      .catch(error => console.log(error));
    break;
  case Environment.TEST:
    Warning.print().currentDB();
    mongoose
      .connect(
        "mongodb+srv://danilo-admin:Password123@srvice-cluster-xxb6t.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useFindAndModify: false },
      )
      .catch(error => console.log(error));
    break;
  default:
    Warning.print().unspecifiedDB();
}

const app = express();

app.use(helmet());
app.use(compression());

const allowedOrigins = ["http://localhost:4200", "http://192.168.0.116:4200", "https://srvice.ca"];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
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
app.use("/send", SendRoutes);
app.use("/admin", AdminRoutes);
app.use("/service-rating", ServiceRatingRoutes);
app.use("/request", RequestRoutes);
app.use("/booking", BookingRoutes);
app.use("/offering", OfferingRoutes);
app.use("/schedule", ScheduleRoutes);
app.use("/file", FileRoutes);
app.use("/chat", ChatRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: `Error: ${error.message}`,
  });
  next();
});

const port = Environment.getGurrentPort();
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Srvice REST API listening on port: ${port}`));

module.exports = server;
