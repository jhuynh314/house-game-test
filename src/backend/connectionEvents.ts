import { Server, DefaultEventsMap, Socket } from "socket.io";

function registerConnectionEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {

  console.log(`User connected : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  
}

export { registerConnectionEvents };
