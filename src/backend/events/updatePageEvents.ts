import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "../enums/pageNameEnum.js";
import { updateHostPage } from "./hostEvents.js";
import { updateSigninPage } from "./signInEvents.js";
import { updateGamePage } from "./gameEvents.js";
import { updateLobbyPage } from "./lobbyEvents.js";

function registerUpdatePageEvents(
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
}

export function goToPage(
  page: string,
  socketId: string,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void {
  io.to(socketId).emit("go-to-page", page);
}

export { registerUpdatePageEvents };

