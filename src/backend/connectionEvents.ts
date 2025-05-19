import { Server, DefaultEventsMap, Socket } from "socket.io";
import db, { getNameBySocketId, insertNewPlayer, updatePlayerSocketId } from "./db.js";

function registerConnectionEvents(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  console.log(`User connected : ${socket.id}`);

  /*
  On disconnect, I want to remove the socketId from the player database.
  This is so that when the player re-connects and logs back in with the same nickname,
  I can add the new socket id to the database with that nickname and preserve other game information
  */
  socket.on("disconnect", async () => {
    const name = await getNameBySocketId(socket.id);
    if (name) {
      db.run(
        `UPDATE players SET socketId = (?) WHERE name = (?)`,
        [null, name],
        (err) => {
          if (err) {
            console.log(err?.message);
          }
        }
      );
      console.log(`DISCONNECTION: ${name} disconnected: ${socket.id}`);
    }
  });

  /*
  On join-game, I want to check if their nickname already exists in the database
    if it does, and there is no socketId -> log in and assign this socketid
    if it does, and there is already a socketId -> someone is already logged in as that user
    if it does not -> create a new row with the name and socketid

  On successful join-game -> send the user to the correct page
    or lobby if they were not on a page already 
  */
  socket.on("join-game", async (name) => {
    if(await nameExists(name)){
      if(await nameHasSocket(name)){
        console.log(`Someone is already logged in as ${name}`);
      } else {
        updatePlayerSocketId(name, socket.id);
      }
    } else {
      insertNewPlayer(name, socket.id);
    }
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

export { registerConnectionEvents };
