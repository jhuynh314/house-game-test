import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const joinButton = document.getElementById("join-game-btn");
  const nicknameInput = <HTMLInputElement>document.getElementById("nickname");
  const hostGameButton = document.getElementById("host-btn");
  const reconnectContainer = document.getElementById("reconnect-container");

  if (joinButton && nicknameInput) {
    joinButton.addEventListener("click", (e) => {
      if (nicknameInput.value)
        socket.emit("join-game", nicknameInput.value.trim());
    });
  }

  if (hostGameButton) {
    hostGameButton?.addEventListener("click", (e) => {
      socket.emit("host-game");
    });
  }

  socket.on("update-signin", (inactivePlayers: string[]) => {
    if (reconnectContainer) {
      reconnectContainer.innerHTML = "";
      inactivePlayers.forEach((player) => {
        const newButton = document.createElement("button");
        newButton.id = "reconnect-btn";
        newButton.setAttribute("name-data", player);
        newButton.innerHTML = player;
        newButton.addEventListener("click", () => {
          const name = newButton.getAttribute("name-data");
          socket.emit("join-game", name);
        });
        reconnectContainer.appendChild(newButton);
      });
    }
  });
});
