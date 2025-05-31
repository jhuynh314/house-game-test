import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./events/connectionEvents.js";
import { registerUpdatePageEvents } from "./events/updatePageEvents.js";
import { registerHostEvents } from "./events/hostEvents.js";
import { registerSignInEvents } from "./events/signInEvents.js";
import { registerLocationEvents } from "./events/locationEvents.js";
import { registerGameEvents } from "./events/gameEvents.js";
import { registerLobbyEvents } from "./events/lobbyEvents.js";

async function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerGameEvents(io, socket);
  registerHostEvents(io, socket);
  registerLobbyEvents(io, socket);
  registerLocationEvents(io, socket);
  registerSignInEvents(io, socket);
  registerUpdatePageEvents(io, socket);
}

export { registerGameHandlers };
