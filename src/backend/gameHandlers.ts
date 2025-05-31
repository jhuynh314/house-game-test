import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./events/connectionEvents.js";
import { registerPageEvents } from "./events/pageEvents.js";
import { registerHostEvents } from "./events/hostEvents.js";
import { registerSignInEvents } from "./events/signInEvents.js";

async function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerHostEvents(io, socket);
  registerSignInEvents(io, socket);
  registerPageEvents(io, socket);
}

export { registerGameHandlers };
