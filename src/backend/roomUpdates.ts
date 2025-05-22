import { Server, DefaultEventsMap, Socket } from "socket.io";
import { RoomName } from "./enums/roomNameEnum.js";

export function joinOnlyRoom(joiningRoom:RoomName, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
  socket.rooms.forEach(room =>{
    if (room !== socket.id){
        socket.leave(room);
    }
  })
  socket.join(joiningRoom);
}