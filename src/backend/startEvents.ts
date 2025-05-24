import { Server, DefaultEventsMap, Socket } from "socket.io";
import {
  clearDatabase,
  getAllActivePlayers,
  insertCard,
  insertNewRoom,
  updatePlayer,
} from "./db.js";
import { RoomName } from "./enums/roomNameEnum.js";
import { PageName } from "./enums/pageNameEnum.js";

function registerStartEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("start-game", async (roomNames: string[]) => {
    const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const activePlayers = await getAllActivePlayers();
    const numOfSymbols = roomNames.length + activePlayers.length;
    const holders = activePlayers.concat(roomNames);

    await clearDatabase();

    roomNames.forEach((roomName) => {
      insertNewRoom(roomName);
    });

    const allSymbols = [];
    for (let i = 0; i < numOfSymbols; i++) {
      allSymbols.push(symbols[i]);
      allSymbols.push(symbols[i]);
      allSymbols.push(symbols[i]);
      allSymbols.push(symbols[i]);
    }

    const shuffledSymbols = shuffleArray(allSymbols);

    let i = 0;
    holders.forEach((holder) => {
      insertCard(holder, shuffledSymbols[i++]);
      insertCard(holder, shuffledSymbols[i++]);
      insertCard(holder, shuffledSymbols[i++]);
      insertCard(holder, shuffledSymbols[i++]);
    });

    activePlayers.forEach((aplayer) => {
      updatePlayer(aplayer, { page: PageName.gamePage });
    });
    io.to(RoomName.game).emit("go-to-page", PageName.gamePage);
  });
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export { registerStartEvents };
