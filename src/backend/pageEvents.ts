import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "./enums/pageNameEnum.js";
import {
  updateGamePage,
  updateHostPage,
  updateLobbyPage,
  updateRoom,
  updateSigninPage,
} from "./pageUpdates.js";
import { joinRoom, leaveRoom } from "./roomUpdates.js";
import { getNameBySocketId, insertCard, removeCard } from "./db.js";

function registerPageEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("get-page-updates", async (page: string) => {
    switch (page) {
      case PageName.lobbyPage:
        await updateLobbyPage(io, socket);
        break;
      case PageName.hostPage:
        await updateHostPage(io);
        break;
      case PageName.gamePage:
        await updateGamePage(io, socket);
        break;
      case PageName.roomPage:
        // Need user name and items the player has and items the room has
        break;
      case PageName.signInPage:
        await updateSigninPage(io);
        break;
      default:
        break;
    }
  });

  socket.on("enter-room", async (room: string) => {
    //get all the cards for the room
    await joinRoom(room, socket);
    await updateRoom(room, io);
  });

  socket.on("leave-room", async (room: string) => {
    leaveRoom(room, socket);
    io.to(socket.id).emit("room-update", [], "");
  });

  socket.on(
    "swap-cards",
    async (roomCard: string, playerCard: string, roomName: string) => {
      const playerName = await getNameBySocketId(socket.id);
      await removeCard(roomName, roomCard);
      await removeCard(playerName!, playerCard);
      await insertCard(roomName, playerCard);
      await insertCard(playerName!, roomCard);

      updateRoom(roomName, io);
      updateGamePage(io, socket);
    }
  );
}

export { registerPageEvents };
