import db from "./db.js";

export function insertAnswerKey(
  keyCard: number,
  column: string,
  row: number,
  answer: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO answerkey (keyCard, column, row, answer) VALUES (?, ?, ?, ?)";
    db.run(sql, [keyCard, column, row, answer], (err) => {
      if (err) {
        console.log("I tried to insert but failed");
        reject(err);
      } else resolve();
    });
  });
}

export function isAnswerKeyEmpty(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as count FROM answerkey";
    db.get(sql, [], (err, row) => {
      if (err) {
        // console.log(err);
        console.log("PIAJFAJWFSDF");
        resolve(true);
      } else resolve((row as { count: number }).count === 0);
    });
  });
}

export function getAnswer(
  keyCard: number,
  column: string,
  row: number
): Promise<number | null> {
  const sql = `SELECT answer FROM answerkey WHERE keyCard = ? AND column = ? AND row = ?;`;
  return new Promise((resolve, reject) => {
    db.get(sql, [keyCard, column, row], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const answer = (row as { answer: number }).answer;
        resolve(answer);
      }
    });
  });
}