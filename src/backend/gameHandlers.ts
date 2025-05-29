import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./events/connectionEvents.js";
import { registerPageEvents } from "./events/pageEvents.js";
import { registerStartEvents } from "./events/startEvents.js";

async function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerPageEvents(io, socket);
  registerStartEvents(io, socket);
}

export { registerGameHandlers };
