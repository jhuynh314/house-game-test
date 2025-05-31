import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "../enums/pageNameEnum.js";
import { RoomName } from "../enums/roomNameEnum.js";
import { goToPage, updateHostPage } from "./pageUpdates.js";
import { joinOnlyRoom } from "./roomUpdates.js";
import db, { getNameBySocketId, getPage, insertNewPlayer, removePlayer, updatePlayer } from "../db.js";

function registerSignInEvents(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    // Check if the nickname already exists in the database
    //   if it does, and there is no socketId -> log in and assign this socketid
    //   if it does, and there is already a socketId -> someone is already logged in as that user, don't log in
    //   if it does not -> create a new row with the name and socketid
    // On successful join-game -> send the user to the correct page and join room
    //   or lobby if they were not on a page already
    socket.on("join-game", async (name) => {
        if (await nameExists(name)) {
            if (await nameHasSocket(name)) {
                console.log(`Someone is already logged in as ${name}`);
                return;
            } else {
                updatePlayer(name, { socketId: socket.id });
            }
        } else {
            // TODO: Will need a check that the socketId is not used already
            insertNewPlayer(name, socket.id, PageName.lobbyPage);
        }
        updateHostPage(io);
        const pageName = await getPage(name);
        if (pageName) {
            joinOnlyRoom(RoomName.game, socket);
            goToPage(pageName, socket.id, io);
        } else {
            console.log(`${name} has no page associated with them`);
        }
    });

    socket.on("leave-game", async () => {
        const name = await getNameBySocketId(socket.id);
        console.log(`PLAYER LEFT: ${name} has signed out`);
        removePlayer(socket.id);
        goToPage(PageName.signInPage, socket.id, io);
        joinOnlyRoom(RoomName.signIn, socket);
        updateHostPage(io);
    });
}

function nameHasSocket(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT socketId FROM players WHERE name = ? AND socketId IS NOT NULL`,
            [name],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!!row);
                }
            }
        );
    });
}

function nameExists(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT name FROM players WHERE name = ?`, [name], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row);
            }
        });
    });
}

export { registerSignInEvents };