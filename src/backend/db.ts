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

export function insertNewPlayer(
  name: string,
  socketId: string,
  page: string
): void {
  db.run(
    `INSERT INTO players (name, socketId, page) VALUES (?, ?, ?)`,
    [name, socketId, page],
    (err) => {
      if (err) {
        console.log(err + ` ${name} or ${socketId} already used`);
      } else {
        console.log(`NEW PLAYER: ${name} has entered`);
      }
    }
  );
}

export function removePlayer(socketId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM players WHERE socketId = ?`;

    db.run(sql, [socketId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function updatePlayer(
  name: string,
  updates: { socketId?: string; page?: string }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.socketId !== undefined) {
    fields.push("socketId = ?");
    if (updates.socketId === "") {
      values.push(null);
    } else {
      values.push(updates.socketId);
    }
  }

  if (updates.page !== undefined) {
    fields.push("page = ?");
    values.push(updates.page);
  }

  if (fields.length === 0) {
    return; // Nothing to update
  }

  const sql = `UPDATE players SET ${fields.join(", ")} WHERE name = ?`;
  values.push(name);

  db.run(sql, values, (err) => {
    if (err) {
      console.log(err?.message);
    } else {
      if (updates.socketId) {
        console.log(`CONNECTION: ${name} reconnected`);
      }
      if (updates.page) {
        console.log(`UPDATE: ${name}'s page is now ${updates.page}`);
      }
    }
  });
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

export function getPage(name: string): Promise<string | null> {
  const sql = `SELECT page FROM players WHERE name = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, name, (err, row) => {
      if (err) reject(err);
      else resolve((row as { page: string }).page);
    });
  });
}

export function getAllActivePlayers(): Promise<string[]> {
  const sql = `SELECT name FROM players WHERE socketId IS NOT NULL;`;
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

export function getAllInactivePlayers(): Promise<string[]> {
  const sql = `SELECT name FROM players WHERE socketId IS NULL;`;
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

export default db;
