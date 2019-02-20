global.fetch = require("node-fetch");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const socketEvents = require('./socketEvents');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const serviceRoutes = require("./routes/service");
const ratingRoutes = require("./routes/rating");
const adminRoutes = require("./routes/admin");
const sendRoutes = require("./routes/send");
const chatRoutes = require("./routes/chat");

const adminPassword = "iakd8k98qogbb8eku1nwzmxdhyhyogxbpn22rub473499rkbpu0hvux4ne6ifjxqqxgvabsxukf0f88904lqxtlf9";

mongoose.connect(`mongodb://${process.env.DOMAIN || "localhost:27017"}/srvice`, { useNewUrlParser: true })
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

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/service", serviceRoutes);
app.use("/rating", ratingRoutes);
app.use("/send", sendRoutes);
app.use("/chat", chatRoutes);

app.use((req, res, next) => {
  const { url, body } = req;
  if (url.split("/")[1] === "admin" && body.adminPassword !== adminPassword) {
    return res.sendStatus(403);
  }
  next();
});

app.use("/admin", adminRoutes);


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
