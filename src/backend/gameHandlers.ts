import { Server, DefaultEventsMap, Socket } from "socket.io";
import { registerConnectionEvents } from "./connectionEvents.js";
import { registerPageEvents } from "./pageEvents.js";
import { registerStartEvents } from "./startEvents.js";
import { insertAnswerKey, isAnswerKeyEmpty } from "./db.js";

async function registerGameHandlers(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  registerConnectionEvents(io, socket);
  registerPageEvents(io, socket);
  registerStartEvents(io, socket);
  const key = await isAnswerKeyEmpty();
  if(key){
    await createAnswerKey();
  }
}

async function createAnswerKey(): Promise<void> {

  const keycard1: number[] = [
    58, 17, 41, 5, 54, 8, 46, 11, 62, 26, 22, 33, 37, 50, 15, 30,
  ];
  const keycard2: number[] = [
    21, 45, 25, 3, 65, 18, 49, 42, 38, 57, 12, 7, 29, 53, 61, 34,
  ];
  const keycard3: number[] = [
    35, 31, 6, 14, 2, 56, 60, 48, 52, 10, 64, 27, 39, 19, 23, 44,
  ];
  const keycard4: number[] = [
    40, 43, 24, 1, 13, 28, 32, 36, 9, 20, 59, 55, 51, 47, 16, 4,
  ];
  const columnLetters = ["A", "B", "C", "D"];

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      await insertAnswerKey(1, columnLetters[i], j, keycard1[i*4 + j]);
    }
  }
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      await insertAnswerKey(2, columnLetters[i], j, keycard2[i*4 + j]);
    }
  }
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      await insertAnswerKey(3, columnLetters[i], j, keycard3[i*4 + j]);
    }
  }
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      await insertAnswerKey(4, columnLetters[i], j, keycard4[i*4 + j]);
    }
  }
}

export { registerGameHandlers };
