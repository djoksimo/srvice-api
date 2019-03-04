global.fetch = require("node-fetch");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const socketEvents = require('./socketEvents');
const {
  AuthenticationRoutes,
  UserRoutes,
  CategoryRoutes,
  ServiceRoutes,
  RatingRoutes,
  AdminRoutes,
  SendRoutes,
  ChatRoutes,
} = require("./routes");

const adminPassword = "iakd8k98qogbb8eku1nwzmxdhyhyogxbpn22rub473499rkbpu0hvux4ne6ifjxqqxgvabsxukf0f88904lqxtlf9";

// prod
// mongoose.connect(`mongodb://${process.env.DOMAIN || "localhost:27017"}/srvice`, { useNewUrlParser: true })

// sandbox01
mongoose.connect("mongodb://sandbox01:sandbox01@ds157735.mlab.com:57735/srvice-sandbox01", { useNewUrlParser: true })
  .catch(error => console.log(error));

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
app.use("/user", UserRoutes);
app.use("/category", CategoryRoutes);
app.use("/service", ServiceRoutes);
app.use("/rating", RatingRoutes);
app.use("/send", SendRoutes);
app.use("/chat", ChatRoutes);

app.use((req, res, next) => {
  const { url, headers } = req;
  if (url.split("/")[1] === "admin" && (!headers.authorization || headers.authorization !== adminPassword)) {
    return res.sendStatus(403);
  }
  next();
});

app.use("/admin", AdminRoutes);


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
