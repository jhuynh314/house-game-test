import db from "./db.js";

export function insertCard(
  holder: string,
  card: string,
  position?: number
): Promise<void> {
  let p = 8;
  if (position) p = position;
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO cards (holder, card, position) VALUES (?, ?, ?)";
    db.run(sql, [holder, card, position], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function getCards(holder: string): Promise<string[]> {
  const sql = `SELECT card FROM cards WHERE holder = ? ORDER BY position ASC;`;
  return new Promise((resolve, reject) => {
    db.all(sql, [holder], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = (rows as { card: string }[]).map((row) => row.card);
        resolve(cards);
      }
    });
  });
}

export function removeCard(holder: string, card: string): Promise<void> {
  //Need to only get the first
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM cards WHERE rowid = (SELECT rowid FROM cards WHERE holder = ? AND card = ? LIMIT 1)";
    db.run(sql, [holder, card], (err) => {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function updateCard(
  holder: string,
  position: number,
  newCard: string
): Promise<void> {
  const sql = `UPDATE cards SET card = ? WHERE holder = ? AND position = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [newCard, holder, position], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}