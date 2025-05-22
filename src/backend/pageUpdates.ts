import { Server, DefaultEventsMap, Socket } from "socket.io";

export function goToPage(
  page: string,
  socketId: string,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  io.to(socketId).emit("go-to-page", page);
}