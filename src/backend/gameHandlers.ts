import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./connectionEvents.js";
import { registerPageEvents } from "./pageEvents.js";

function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerPageEvents(io, socket);
}

export { registerGameHandlers };
