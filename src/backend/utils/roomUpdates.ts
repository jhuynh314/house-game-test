import { Server, DefaultEventsMap, Socket } from "socket.io";
import { RoomName } from "../enums/roomNameEnum.js";

export function joinOnlyRoom(
  joiningRoom: RoomName,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  socket.rooms.forEach((room) => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
  socket.join(joiningRoom);
}

export async function joinRoom(
  roomName: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  socket.join(roomName);
}

export function leaveRoom(
  roomName: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  socket.leave(roomName);
}