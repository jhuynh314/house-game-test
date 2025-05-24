import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const enterRoomButton = document.getElementById("enter-room-btn");
  const playerCardContainer = document.getElementById("player-cards");
  const roomCardContainer = document.getElementById("room-cards");
  const roomSelectorPopup = document.getElementById("room-selector-popup");
  const roomButtonsContainer = document.getElementById(
    "room-buttons-container"
  );
  const roomCardsTitle = document.getElementById("room-cards-title");

  socket.on(
    "update-game",
    (playerName: string, playerCards: string[], roomNames: string[]) => {
      // Do somthing with name
      console.log(`${playerName} has the following cards: ${playerCards}`);
      console.log(`Rooms are ${roomNames}`);

      // player cards
      if (playerCardContainer) {
        playerCardContainer.innerHTML = "";
        playerCards.forEach((card) => {
          const newH = document.createElement("h3");
          newH.textContent = card;
          playerCardContainer.appendChild(newH);
        });
      }

      //room buttons
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
  );

  socket.on("room-update", (roomCards: string[], roomName:string) => {
    console.log(roomCards);
    if (roomCardContainer && roomCardsTitle) {
      roomCardContainer.innerHTML = "";
      roomCards.forEach((card) => {
        const newH = document.createElement("h3");
        newH.textContent = card;
        roomCardContainer.appendChild(newH);
      });
      roomCardsTitle.textContent = roomName + " cards"
    }
  });

  if (enterRoomButton && roomSelectorPopup) {
    enterRoomButton.addEventListener("click", () => {
      roomSelectorPopup.style.display = "flex";
    });
  }

  // if (yesButton && roomSelectorPopup) {
  //   yesButton.addEventListener("click", function () {
  //     alert("You clicked Yes!");
  //     roomSelectorPopup.style.display = "none";
  //   });
  // }

  // if (noButton && roomSelectorPopup) {
  //   noButton.addEventListener("click", function () {
  //     alert("You clicked No!");
  //     roomSelectorPopup.style.display = "none";
  //   });
  // }
});
