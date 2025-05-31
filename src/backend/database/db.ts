import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("game.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            socketId TEXT UNIQUE,
            page TEXT
            );
        `);

  db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            keyCard INTEGER
            );
        `);

  db.run(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            holder TEXT,
            card TEXT,
            position INTEGER
            );
        `);

  db.run(`
        CREATE TABLE IF NOT EXISTS answerkey (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keyCard INTEGER,
            column TEXT,
            row INTEGER,
            answer INTEGER
            );
        `);
});

export function clearDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql1 = "DELETE FROM players WHERE socketId IS NULL";
    db.run(sql1, [], (err) => {
      if (err) reject(err);
      else {
        const sql2 = "DELETE FROM rooms";
        db.run(sql2, [], (err) => {
          if (err) reject(err);
          else {
            const sql3 = "DELETE FROM cards";
            db.run(sql3, [], (err) => {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      }
    });
  });
}

export function resetPlayers(): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql1 = "DELETE FROM players";
    db.run(sql1, [], (err) => {
      if (err) reject(err);
      else {
        const sql2 = "DELETE FROM cards";
        db.run(sql2, [], (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}

export default db;
