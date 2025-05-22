import { Server, DefaultEventsMap, Socket } from "socket.io";
import { getAllActivePlayers, updatePlayer } from "./db.js";
import { RoomName } from "./enums/roomNameEnum.js";
import { PageName } from "./enums/pageNameEnum.js";

function registerStartEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    socket.on('start-game', async ()=>{
        const activePlayers = await getAllActivePlayers();
        activePlayers.forEach((aplayer)=>{
            updatePlayer(aplayer, {page: PageName.gamePage})
        });
        io.to(RoomName.game).emit('go-to-page', PageName.gamePage);
    });
}

export {registerStartEvents}