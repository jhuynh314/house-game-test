import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "../enums/pageNameEnum.js";
import { RoomName } from "../enums/roomNameEnum.js";
import { joinOnlyRoom } from "../utils/roomUpdates.js";
import { getNameBySocketId, removePlayer } from "../db.js";
import { updateHostPage } from "./hostEvents.js";
import { goToPage } from "./updatePageEvents.js";

function registerLobbyEvents(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {

    socket.on("leave-game", async () => {
        const name = await getNameBySocketId(socket.id);
        console.log(`PLAYER LEFT: ${name} has signed out`);
        removePlayer(socket.id);
        goToPage(PageName.signInPage, socket.id, io);
        joinOnlyRoom(RoomName.signIn, socket);
        updateHostPage(io);
    });
}

export async function updateLobbyPage(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    // Need logged in user to display at the top of the screen
    const nickname = await getNameBySocketId(socket.id);
    io.to(socket.id).emit("update-lobby", nickname);
}

export { registerLobbyEvents };