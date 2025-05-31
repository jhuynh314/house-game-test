import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "../enums/pageNameEnum.js";
import { RoomName } from "../enums/roomNameEnum.js";
import { goToPage, updateHostPage } from "./pageUpdates.js";
import { joinOnlyRoom } from "./roomUpdates.js";
import { clearDatabase, getAllActivePlayers, insertCard, insertNewRoom, resetPlayers, updatePlayer } from "../db.js";

function registerHostEvents(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {

    // Join the host room and go to the host page
    socket.on("host-game", async () => {
        joinOnlyRoom(RoomName.host, socket);
        goToPage(PageName.hostPage, socket.id, io);
    });

    socket.on("remove-all-players", async () => {
        const allSockets = io.sockets.sockets;
        allSockets.forEach((sock) => {
            if (sock.id !== socket.id) {
                joinOnlyRoom(RoomName.signIn, sock);
            }
        });
        io.except(socket.id).emit("go-to-page", PageName.signInPage);
        resetPlayers();
        updateHostPage(io);
    });

      socket.on("start-game", async (roomNames: string[]) => {
        // const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
        const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "<", ">", ";", "-", "=", "+", "~", "?"];
    
        const activePlayers = await getAllActivePlayers();
        const numOfSymbols = roomNames.length + activePlayers.length;
        const holders = activePlayers.concat(roomNames);
    
        await clearDatabase();
    
        let keyCardNum = 1;
        roomNames.forEach((roomName) => {
          insertNewRoom(roomName, keyCardNum);
          keyCardNum ++;
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
          insertCard(holder, shuffledSymbols[i++], 0);
          insertCard(holder, shuffledSymbols[i++], 1);
          insertCard(holder, shuffledSymbols[i++], 2);
          insertCard(holder, shuffledSymbols[i++], 3);
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

export { registerHostEvents };