import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerContainer = document.getElementById("player-container");
  const signOutButton = document.getElementById("host-sign-out-btn");
  const startGameButton = document.getElementById("start-game-btn");

  socket.on("update-host", (names: string[]) => {
    if (playerContainer) {
      playerContainer.innerHTML = "";
      names.forEach((name) => {
        const newp = document.createElement("p");
        newp.textContent = name;
        playerContainer.appendChild(newp);
      });
    }
  });

  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      const rooms = document.querySelectorAll<HTMLInputElement>(".room-name");
      const roomNames: string[] = Array.from(rooms).map(room => room.value);

      socket.emit("start-game", roomNames);
      startGameButton.setAttribute('disabled', 'disabled');
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      socket.emit("leave-game");
    });
  }
});
