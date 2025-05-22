import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerContainer = document.getElementById("player-container");
  const signOutButton = document.getElementById("host-sign-out-btn");
  const startGameButton = document.getElementById("start-game-btn");

  socket.on("update-host", (names: string[]) => {
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

  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      socket.emit("start-game");
      startGameButton.setAttribute('disabled', 'disabled');
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      socket.emit("leave-game");
    });
  }
});
