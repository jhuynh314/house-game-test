import socket from './socket.js';

document.addEventListener("DOMContentLoaded", () => {
  const joinButton = document.getElementById("join-game-btn");
  const nicknameInput = <HTMLInputElement>document.getElementById("nickname");

  if (joinButton && nicknameInput) {
    joinButton.addEventListener("click", (e) => {
      if (nicknameInput.value) socket.emit("join-game", nicknameInput.value);
    });
  }
});
