import db from "./db.js";

export function insertNewRoom(
  roomName: string,
  keyCardNum: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO rooms (name, keyCard) VALUES (?, ?)";
    db.run(sql, [roomName, keyCardNum], (err) => {
      if (err) reject(err);
      else resolve;
    });
  });
}

export function getRoomNames(): Promise<string[]> {
  const sql = `SELECT name FROM rooms`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const names = (rows as { name: string }[]).map((row) => row.name);
        resolve(names);
      }
    });
  });
}

export function getAnswerKey(roomName: string): Promise<number> {
  const sql = `SELECT keyCard FROM rooms WHERE name = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [roomName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const keyCard = (row as { keyCard: number }).keyCard;
        resolve(keyCard);
      }
    });
  });
}

export function getAllRooms(): Promise<string[]>{
  const sql = `SELECT name FROM rooms ORDER BY keyCard ASC;`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const names = (rows as { name: string }[]).map((row) => row.name);
        resolve(names);
      }
    });
  });
}