import { Server, DefaultEventsMap, Socket } from "socket.io";
import { getPage } from "./db.js";

function registerPageUpdateEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
   
}

export { registerPageUpdateEvents };
