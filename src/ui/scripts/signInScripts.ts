import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const joinButton = document.getElementById("join-game-btn");
  const nicknameInput = <HTMLInputElement>document.getElementById("nickname");
  const hostGameButton = document.getElementById("host-btn");

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
    console.log(inactivePlayers);
  });
});
