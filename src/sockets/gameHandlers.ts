import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./connectionEvents";

function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
}

export { registerGameHandlers };
