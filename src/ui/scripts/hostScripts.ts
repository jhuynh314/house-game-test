import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  socket.on("update-host", (names: string[]) => {
    console.log(`My players are ${names}`);
    //update host section to include the names
  });
});
