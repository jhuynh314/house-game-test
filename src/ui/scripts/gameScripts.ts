import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const enterRoomButton = document.getElementById("enter-room-btn");
  const playerCardContainer = document.getElementById("player-cards-container");
  const roomSelectorPopup = document.getElementById("room-selector-popup");
  const yesButton = document.getElementById("yesBtn");
  const noButton = document.getElementById("noBtn");

  socket.on("update-game", (playerName: string, playerCards: string[]) => {
    // Do somthing with name
    console.log(`${playerName} has the following cards: ${playerCards}`);
    if (playerCardContainer) {
      playerCardContainer.innerHTML = "";
      playerCards.forEach((card) => {
        const newH = document.createElement("h3");
        newH.textContent = card;
        playerCardContainer.appendChild(newH);
      });
    }
  });

  if (enterRoomButton && roomSelectorPopup) {
    enterRoomButton.addEventListener("click", () => {
      roomSelectorPopup.style.display = "flex";
    });
  }

  if (yesButton && roomSelectorPopup) {
    yesButton.addEventListener("click", function () {
      alert("You clicked Yes!");
      roomSelectorPopup.style.display = "none";
    });
  }

  if (noButton && roomSelectorPopup) {
    noButton.addEventListener("click", function () {
      alert("You clicked No!");
      roomSelectorPopup.style.display = "none";
    });
  }
});
