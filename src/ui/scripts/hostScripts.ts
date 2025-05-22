import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerContainer = document.getElementById("player-container");
  const signOutButton = document.getElementById("host-sign-out-btn");

  socket.on("update-host", (names: string[]) => {
    console.log(`My players are ${names}`);
    if (playerContainer) {
      playerContainer.innerHTML = "";
      names.forEach((name) => {
        console.log(name);
        const newp = document.createElement("p");
        newp.textContent = name;
        playerContainer.appendChild(newp);
      });
    }
  });

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      socket.emit("leave-game");
    });
  }
});
