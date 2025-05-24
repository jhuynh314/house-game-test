import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "./enums/pageNameEnum.js";
import { getNameBySocketId } from "./db.js";
import { updateGamePage, updateHostPage, updateLobbyPage, updateSigninPage } from "./pageUpdates.js";

function registerPageEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    socket.on('get-page-updates', async (page: string)=>{
        switch(page) {
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
    })
}

export { registerPageEvents };
