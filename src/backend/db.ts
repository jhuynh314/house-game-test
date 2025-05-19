import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("game.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            socketId TEXT UNIQUE,
            page TEXT
            );
        `);

export function insertNewPlayer(name: string, socketId: string): void {
  db.run(
    `INSERT INTO players (name, socketId) VALUES (?, ?)`,
    [name, socketId],
    (err) => {
      if (err) {
        console.log(err + ` ${name} or ${socketId} already used`);
      } else {
        console.log(`NEW PLAYER: ${name} has entered`);
      }
    }
  );
}

export function updatePlayerSocketId(name:string, socketId: string): void {
  db.run(
          `UPDATE players SET socketId = (?) WHERE name = (?)`,
          [socketId, name],
          (err) => {
            if (err) {
              console.log(err?.message);
            } else {
              console.log(`CONNECTION: ${name} reconnected`)
            }
          }
        );
}

export function getNameBySocketId(socketId: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT name FROM players WHERE socketId = ?`,
      [socketId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row && typeof row === "object" && "name" in row) {
          resolve((row as { name: string }).name);
        } else {
          resolve(null);
        }
      }
    );
  });
}

export default db;
