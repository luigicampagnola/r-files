const http = require("http");

const app = require("./app");

const PORT = 4004;

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
