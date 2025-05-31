import { Server, DefaultEventsMap, Socket } from "socket.io";
import { joinRoom, leaveRoom } from "../utils/roomUpdates.js";
import { updateGamePage } from "./gameEvents.js";
import { getAnswer } from "../database/answerkeyTableFunctions.js";
import { updateCard, getCards } from "../database/cardsTableFunctions.js";
import { getNameBySocketId } from "../database/playersTableFunctions.js";
import { getAnswerKey } from "../database/roomsTableFunctions.js";

function registerLocationEvents(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
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
        async (roomName: string) => {
            // Get question and answer for room
            const column = getRandomInt(0, 3);
            const columnLetters = ["A", "B", "C", "D"];
            const row = getRandomInt(1, 4);
            const answerKey = await getAnswerKey(roomName);
            const question = `What number is at ${columnLetters[column]}${row}`;
            const answer = await getAnswer(answerKey, columnLetters[column], row);
            io.to(socket.id).emit("room-question", question, answer, roomName);
        }
    )
}

export async function updateRoom(
    roomName: string,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Promise<void> {
    const roomCards = await getCards(roomName);
    io.to(roomName).emit("room-update", roomCards, roomName);
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { registerLocationEvents };