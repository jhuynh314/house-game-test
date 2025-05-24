import { Server, DefaultEventsMap, Socket } from "socket.io";
import {
  getAllActivePlayers,
  getAllInactivePlayers,
  getCards,
  getNameBySocketId,
} from "./db.js";
import { RoomName } from "./enums/roomNameEnum.js";

export function goToPage(
  page: string,
  socketId: string,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  io.to(socketId).emit("go-to-page", page);
}

export async function updateLobbyPage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  // Need logged in user to display at the top of the screen
  const nickname = await getNameBySocketId(socket.id);
  io.to(socket.id).emit("update-lobby", nickname);
}

export async function updateHostPage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  const players = await getAllActivePlayers();
  io.to(RoomName.host).emit("update-host", players);
}

export async function updateSigninPage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  const inactivePlayers = await getAllInactivePlayers();
  io.to(RoomName.signIn).emit("update-signin", inactivePlayers);
}

export async function updateGamePage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  // Need player name and the cards they have
  // emit should only go to the player who asked for the update
  const playerName = await getNameBySocketId(socket.id);
  if(playerName){
    const playerCards = await getCards(playerName);
    io.to(socket.id).emit("update-game", playerName, playerCards);
  }
}
