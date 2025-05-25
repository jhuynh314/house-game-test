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
  if (key) {
    await createAnswerKey();
  }
}

async function createAnswerKey(): Promise<void> {
  const keycards = [];

  const keycard1: number[] = [24, 73, 58, 66, 91, 11, 34, 47, 81, 15, 53, 39, 78, 26, 64, 88];
  const keycard2: number[] = [42, 87, 19, 75, 59, 38, 93, 17, 61, 26, 91, 44, 35, 62, 13, 55];
  const keycard3: number[] = [33, 62, 84, 49, 75, 94, 18, 68, 42, 59, 11, 21, 87, 90, 25, 37];
  const keycard4: number[] = [71, 14, 27, 34, 88, 52, 76, 95, 39, 68, 63, 60, 19, 40, 48, 82];
  const keycard5: number[] = [90, 46, 65, 98, 44, 16, 28, 73, 92, 13, 31, 86, 33, 18, 77, 25];
  const keycard6: number[] = [17, 25, 32, 83, 19, 71, 61, 55, 74, 94, 49, 70, 63, 93, 84, 12];
  const keycard7: number[] = [65, 31, 93, 45, 39, 63, 10, 85, 67, 97, 22, 13, 55, 34, 91, 28];
  const keycard8: number[] = [56, 21, 41, 11, 62, 85, 95, 31, 20, 88, 70, 46, 40, 79, 33, 97];
  const keycard9: number[] = [13, 99, 48, 36, 16, 32, 71, 90, 23, 35, 30, 91, 12, 44, 59, 63];
  const keycard10: number[] = [84, 35, 75, 61, 20, 29, 46, 12, 38, 41, 85, 97, 95, 76, 73, 19];

  keycards.push(keycard1, keycard2, keycard3, keycard4, keycard5, keycard6, keycard7, keycard8, keycard9, keycard10);
  const columnLetters = ["A", "B", "C", "D"];

  keycards.forEach(async (keycard, index) => {
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        await insertAnswerKey(index+1, columnLetters[i], j, keycard[i * 4 + j]);
      }
    }
  });
}

export { registerGameHandlers };
