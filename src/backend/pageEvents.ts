import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "./enums/pageNameEnum.js";
import { getAllActivePlayers, getAllInactivePlayers, getNameBySocketId } from "./db.js";
import { RoomName } from "./enums/roomNameEnum.js";
import { updateHostPage } from "./pageUpdates.js";

function registerPageEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    socket.on('get-page-updates', async (page: string)=>{
        switch(page) {
            case PageName.lobbyPage:
                // Need logged in user to display at the top of the screen
                const nickname = await getNameBySocketId(socket.id);
                io.to(socket.id).emit('update-lobby', nickname);
                break;
            case PageName.hostPage:
                await updateHostPage(io);
                break;
            case PageName.gamePage:
                // Need user name and items the player has
                break;
            case PageName.roomPage:
                // Need user name and items the player has and items the room has
                break;
            case PageName.signInPage:
                // Need list of all players without socketId for reconnections
                // should emit to sign in room
                const inactivePlayers = await getAllInactivePlayers();
                io.to(RoomName.signIn).emit('update-signin', inactivePlayers);
                break;
            default:
                break;
        }
    })
}

export { registerPageEvents };
