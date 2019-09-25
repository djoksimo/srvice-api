global.fetch = require("node-fetch");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

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
  ProductRoutes,
  FileRoutes,
  ScheduleRoutes,
  ChatRoutes,
} = require("./routes");

const dbInst = process.env.NODE_ENV;

switch (dbInst) {
  case "SANDBOX_01":
    console.log("USING SANDBOX DB");
    mongoose.connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", { useNewUrlParser: true })
      .catch(error => console.log(error));
    break;
  case "TEST":
    console.log("USING TEST DB");
    mongoose.connect("mongodb+srv://danilo-admin:Password123@srvice-cluster-xxb6t.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
      .catch(error => console.log(error));
    break;
  default:
    console.log("\x1b[31m", `DB NOT SPECIFIED ⚠️  ⚠️  ⚠️\n\n`);
    console.log("\x1b[36m", `To fix on Linux or Mac:\n`);
    console.log("\x1b[37m", `export NODE_ENV="<ENVIRONMENT-NAME>" \n\n e.g. export NODE_ENV="TEST"\n\n`);
    console.log("\x1b[36m", "To fix on Windows:\n");
    console.log("\x1b[37m", `setx NODE_ENV "<ENVIRONMENT-NAME>" \n\n e.g. set NODE_ENV "TEST"`);
    process.exit(1);
}

const app = express();

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
app.use("/send", SendRoutes);
app.use("/admin", AdminRoutes);
app.use("/service-rating", ServiceRatingRoutes);
app.use("/request", RequestRoutes);
app.use("/booking", BookingRoutes);
app.use("/product", ProductRoutes);
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
});

const port = process.env.PORT || '5000';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Srvice REST API listening on port: ${port}`));

module.exports = server;
