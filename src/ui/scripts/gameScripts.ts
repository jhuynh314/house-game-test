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
  const roomPasswordPopup = document.getElementById("room-password-popup");
  const questionRoomName = document.getElementById("question-room-name");
  const questionText = document.getElementById("question");
  const answerText = document.getElementById("answer");
  const answerTextBox = <HTMLInputElement>(
    document.getElementById("answer-textbox")
  );
  const answerButton = document.getElementById("answer-btn");
  const leaveButton = document.getElementById("leave-btn");

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
              socket.emit("get-room-question", roomName);
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

  socket.on(
    "room-question",
    (question: string, answer: string, roomName: string) => {
      if (questionRoomName && questionText && answerText && roomPasswordPopup) {
        questionRoomName.textContent = roomName;
        questionText.textContent = question;
        answerText.textContent = answer;
        roomPasswordPopup.style.display = "flex";
      }
    }
  );

  if (enterRoomButton && roomSelectorPopup) {
    enterRoomButton.addEventListener("click", () => {
      answerButton?.classList.add("active");
      leaveButton?.classList.remove("active");
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
      socket.emit("get-room-question", roomCardsTitle!.textContent);
      answerButton?.classList.remove("active");
      leaveButton?.classList.add("active");
    });
  }

  if (leaveButton) {
    leaveButton.addEventListener("click", () => {
      if (answerTextBox.value === answerText!.textContent) {
        socket.emit("leave-room", roomCardsTitle!.textContent);
      }
      answerTextBox.value = "";
      roomPasswordPopup!.style.display = "none";
    });
  }

  if (
    roomPasswordPopup &&
    answerButton &&
    answerTextBox &&
    answerText &&
    questionRoomName
  ) {
    answerButton.addEventListener("click", () => {
      if (answerTextBox.value === answerText.textContent) {
        socket.emit("enter-room", questionRoomName.textContent);
      }
      answerTextBox.value = "";
      roomPasswordPopup.style.display = "none";
    });
  }
});
