const http = require("http");

export const createServer = (app, port = "5000") => {
  const server = http.createServer(app);

  server.listen(port, () => console.log(`Srvice REST API listening on port: ${port}`));

  return server;
};