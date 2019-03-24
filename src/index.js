global.fetch = require("node-fetch");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const socketEvents = require('./socketEvents');
const Bottle = require("./bottle");
const {
  AuthenticationRoutes,
  AgentRoutes,
  UserRoutes,
  CategoryRoutes,
  ServiceRoutes,
  RequestRoutes,
  BookingRoutes,
  RatingRoutes,
  AdminRoutes,
  SendRoutes,
  ChatRoutes,
} = require("./routes");

const dbInst = process.env.NODE_ENV;

switch (dbInst) {
  case "prod":
    mongoose.connect(`mongodb://${process.env.DOMAIN || "localhost:27017"}/srvice`, { useNewUrlParser: true })
      .catch((error) => console.log(error));
    break;
  case "sandbox01":
    mongoose.connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", { useNewUrlParser: true })
      .catch(error => console.log(error));
    break;
  case "test":
    mongoose.connect("mongodb://danilo:BlackBerry123@ds117913.mlab.com:17913/srvice-test", { useNewUrlParser: true })
      .catch(error => console.log(error));
    break;
  default:
    mongoose.connect(`mongodb://${process.env.DOMAIN || "localhost:27017"}/srvice`, { useNewUrlParser: true })
      .catch((error) => console.log(error));
}

const app = express();
const authenticationManager = Bottle.AuthenticationManager;

const allowedOrigins = ['http://localhost:4200', 'http://192.168.0.116:4200', 'https://srvice.ca'];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
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
app.use("/rating", RatingRoutes);
app.use("/send", SendRoutes);
app.use("/chat", ChatRoutes);
app.use("/admin", AdminRoutes);
app.use((req, res, next) => {
  authenticationManager.authenticateIdEmailToken(req.body)
    .then(() => next())
    .catch(() => res.status(403).json({}));
});
app.use("/request", RequestRoutes);
app.use("/booking", BookingRoutes);

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
});

const port = process.env.PORT || '5000';

app.set('port', port);

const server = http.createServer(app);
const io = require('socket.io')(server);
socketEvents(io);

server.listen(port, () => console.log(`Srvice REST API listening on port: ${port}`));

module.exports = server;
