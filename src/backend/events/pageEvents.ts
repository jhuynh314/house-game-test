import { Server, DefaultEventsMap, Socket } from "socket.io";
import { PageName } from "../enums/pageNameEnum.js";
import {
  updateGamePage,
  updateHostPage,
  updateLobbyPage,
  updateRoom,
  updateSigninPage,
} from "./pageUpdates.js";
import { joinRoom, leaveRoom } from "./roomUpdates.js";
import { getAnswer, getAnswerKey, getNameBySocketId, updateCard } from "../db.js";

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
    async (roomCard: string, roomCardPos: number, playerCard: string, playerCardPos: number, roomName: string) => {
      const playerName = await getNameBySocketId(socket.id);
      await updateCard(roomName, roomCardPos, playerCard);
      await updateCard(playerName!, playerCardPos, roomCard);
      updateRoom(roomName, io);
      updateGamePage(io, socket);
    }
  );

  socket.on(
    "get-room-question",
    async (roomName:string) =>{
      // Get question and answer for room
      const column = getRandomInt(0, 3);
      const columnLetters = ["A", "B", "C", "D"];
      const row = getRandomInt(0,3);
      const answerKey = await getAnswerKey(roomName);
      const question = `What number is at ${columnLetters[column]}${row}`;
      const answer = await getAnswer(answerKey, columnLetters[column], row);
      io.to(socket.id).emit("room-question", question, answer, roomName);
    }
  )
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { registerPageEvents };
