import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const enterRoomButton = document.getElementById("enter-room-btn");
  const roomSelectorPopup = document.getElementById("room-selector-popup");
  const yesButton = document.getElementById("yesBtn");
  const noButton = document.getElementById("noBtn");

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
