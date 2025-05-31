import { Server, DefaultEventsMap, Socket } from "socket.io";
import {
  getNameBySocketId,
  updatePlayer,
} from "../db.js";
import { RoomName } from "../enums/roomNameEnum.js";
import { updateHostPage } from "./hostEvents.js";
import { updateSigninPage } from "./signInEvents.js";

function registerConnectionEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  console.log(`User connected : ${socket.id}`);
  socket.join(RoomName.signIn);
  updateSigninPage(io);

  // On disconnect, I want to remove the socketId from the player database.
  // This is so that when the player re-connects and logs back in with the same nickname,
  // I can add the new socket id to the database with that nickname and preserve other game information
  socket.on("disconnect", async () => {
    const name = await getNameBySocketId(socket.id);
    if (name) {
      updatePlayer(name, { socketId: "" });
      console.log(`DISCONNECTION: ${name} disconnected: ${socket.id}`);
    }
    updateHostPage(io);
  });
}

export { registerConnectionEvents };
