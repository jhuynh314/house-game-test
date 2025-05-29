import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerContainer = document.getElementById("player-container");
  const signOutButton = document.getElementById("host-sign-out-btn");
  const startGameButton = document.getElementById("start-game-btn");
  const removePlayersButton = document.getElementById("reset-players-btn");
  const addRoomButton = document.getElementById("add-room-btn");
  const removeRoomButton = document.getElementById("remove-room-btn");
  const roomNameContainer = document.getElementById("room-name-container");
  const qrCodeImage = <HTMLImageElement>document.getElementById("qr");

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

  socket.on("update-qr-code", (dataUrl: string)=>{
    console.log("I made it here");
    qrCodeImage!.src = dataUrl;
  });

  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      const rooms = document.querySelectorAll<HTMLInputElement>(".room-name");
      const roomNames: string[] = Array.from(rooms).map((room) => room.value);

      socket.emit("start-game", roomNames);
      // startGameButton.setAttribute("disabled", "disabled");
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      socket.emit("leave-game");
    });
  }

  if (removePlayersButton) {
    removePlayersButton.addEventListener("click", ()=>{
      console.log("I was clicked")
      socket.emit("remove-all-players");
    });
  }

  if (addRoomButton) {
    addRoomButton.addEventListener("click", () => {
      const rooms = document.querySelectorAll<HTMLInputElement>(".room-name");
      const numOfRooms = rooms.length;

      const newDiv = document.createElement("div");
      const newLabel = document.createElement("label");
      const newInput = document.createElement("input");

      newLabel.htmlFor = `room${numOfRooms + 1}-name`;
      newLabel.textContent = `Room ${numOfRooms + 1}: `;

      newInput.type = "text";
      newInput.id = `room${numOfRooms + 1}-name`;
      newInput.classList.add("room-name");

      newDiv.appendChild(newLabel);
      newDiv.appendChild(newInput);

      if (roomNameContainer) {
        roomNameContainer.appendChild(newDiv);
      }
    });
  }

  if (removeRoomButton) {
    removeRoomButton.addEventListener("click", () => {
      const rooms = document.querySelectorAll<HTMLInputElement>(".room-name");
      const lastRoom = rooms[rooms.length - 1];
      const parent = lastRoom.parentElement;
      if (parent) {
        parent.remove();
      }
    });
  }
});
