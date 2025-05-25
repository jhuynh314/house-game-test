import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const enterRoomButton = document.getElementById("enter-room-btn");
  const leaveRoomButton = document.getElementById("leave-room-btn");
  const swapCardsButton = document.getElementById("swap-cards-btn");
  const playerCardContainer = document.getElementById("player-cards");
  const roomCardContainer = document.getElementById("room-cards");
  const roomSelectorPopup = document.getElementById("room-selector-popup");
  const roomButtonsContainer = document.getElementById(
    "room-buttons-container"
  );
  const roomCardsTitle = document.getElementById("room-cards-title");

  socket.on(
    "update-game",
    (playerName: string, playerCards: string[], roomNames?: string[]) => {
      // Do somthing with name

      // player cards
      if (playerCardContainer) {
        playerCardContainer.innerHTML = "";
        playerCards.forEach((card) => {
          const newH = document.createElement("h3");
          newH.classList.add("player-card");
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
              socket.emit("enter-room", roomName);
              roomSelectorPopup!.style.display = "none";
            });
            roomButtonsContainer.appendChild(newB);
          });
        }
      }
    }
  );

  socket.on("room-update", (roomCards: string[], roomName: string) => {
    if (
      roomCardContainer &&
      roomCardsTitle &&
      swapCardsButton &&
      leaveRoomButton
    ) {
      roomCardContainer.innerHTML = "";
      roomCards.forEach((card) => {
        const newH = document.createElement("h3");
        newH.textContent = card;
        newH.classList.add("room-card");

        newH.addEventListener("click", () => {
          const pcards = document.querySelectorAll(".room-card");
          pcards.forEach((card) => {
            card.classList.remove("highlighted");
          });
          newH.classList.add("highlighted");
        });

        roomCardContainer.appendChild(newH);
      });
      roomCardsTitle.textContent = roomName;
      if (roomName != "") {
        swapCardsButton.classList.add("active");
        leaveRoomButton.classList.add("active");
        enterRoomButton?.classList.remove("active");
      } else {
        swapCardsButton!.classList.remove("active");
        leaveRoomButton!.classList.remove("active");
        enterRoomButton!.classList.add("active");
      }
    }
  });

  if (enterRoomButton && roomSelectorPopup) {
    enterRoomButton.addEventListener("click", () => {
      roomSelectorPopup.style.display = "flex";
    });
  }

  if (swapCardsButton) {
    swapCardsButton.addEventListener("click", () => {
      const roomCard = document.querySelector(
        ".room-card.highlighted"
      )?.textContent;
      const playerCard = document.querySelector(
        ".player-card.highlighted"
      )?.textContent;
      const roomName = roomCardsTitle!.textContent!;
      if (roomCard && playerCard && roomCardsTitle) {
        socket.emit("swap-cards", roomCard, playerCard, roomName);
      }
    });
  }

  if (leaveRoomButton) {
    leaveRoomButton.addEventListener("click", () => {
      socket.emit("leave-room", roomCardsTitle!.textContent);
    });
  }
});
