import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
import {registerGameHandlers} from './backend/gameHandlers';

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  app.use(express.static('./dist/ui'));
  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./ui/index.html"));
  });

  io.on("connection", async (socket) => {
    registerGameHandlers(io, socket);
  });

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

main();
