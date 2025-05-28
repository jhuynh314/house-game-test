import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerCardContainer = document.getElementById("player-cards");
  const roomSelectorPopup = document.getElementById("room-selector-popup");
  const roomButtonsContainer = document.getElementById(
    "room-buttons-container"
  );

  socket.on(
    "update-game",
    (playerName: string, playerCards: string[], roomNames?: string[]) => {
      // Do somthing with name

      // player cards
      if (playerCardContainer) {
        playerCardContainer.innerHTML = "";
        playerCards.forEach((card, index) => {
          const newH = document.createElement("h3");
          newH.classList.add("player-card");
          newH.setAttribute("position", index.toString());
          newH.textContent = card;

          newH.addEventListener("click", () => {
            const pcards = document.querySelectorAll(".player-card");
            pcards.forEach((card) => {
              card.classList.remove("highlighted");
            });
            newH.classList.add("highlighted");
          });

          playerCardContainer.appendChild(newH);
        });
      }

      //room buttons
      if (roomNames) {
        if (roomButtonsContainer) {
          roomButtonsContainer.innerHTML = "";
          roomNames.forEach((roomName) => {
            const newB = document.createElement("button");
            newB.textContent = roomName;
            newB.addEventListener("click", () => {
              socket.emit("get-room-question", roomName);
              roomSelectorPopup!.style.display = "none";
            });
            roomButtonsContainer.appendChild(newB);
          });
        }
      }
    }
  );
});
