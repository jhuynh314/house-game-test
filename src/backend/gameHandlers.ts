import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./connectionEvents.js";
import { registerPageUpdateEvents } from "./pageUpdateEvents.js";

function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerPageUpdateEvents(io, socket);
}

export { registerGameHandlers };
