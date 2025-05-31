import { Server, DefaultEventsMap, Socket } from "socket.io";
import { getCards } from "../database/cardsTableFunctions.js";
import { getNameBySocketId } from "../database/playersTableFunctions.js";
import { getRoomNames } from "../database/roomsTableFunctions.js";

function registerGameEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {

}

export async function updateGamePage(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
  // Need player name and the cards they have
  // emit should only go to the player who asked for the update
  const playerName = await getNameBySocketId(socket.id);
  if (playerName) {
    const playerCards = await getCards(playerName);
    const roomNames = await getRoomNames();
    io.to(socket.id).emit("update-game", playerName, playerCards, roomNames);
  }
}

export { registerGameEvents };