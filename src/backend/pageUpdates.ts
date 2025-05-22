import { Server, DefaultEventsMap, Socket } from "socket.io";
import { getAllActivePlayers } from "./db.js";
import { RoomName } from "./enums/roomNameEnum.js";

export function goToPage(
  page: string,
  socketId: string,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  io.to(socketId).emit("go-to-page", page);
}

export async function updateHostPage(
  io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  const players = await getAllActivePlayers();
  io.to(RoomName.host).emit("update-host", players);
}