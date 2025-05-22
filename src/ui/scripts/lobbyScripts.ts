import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("lobby-title");
  const signOutButton = document.getElementById('sign-out-btn');


  if(signOutButton){
    signOutButton.addEventListener('click', ()=>{
        socket.emit("leave-game");
    })
  }

  socket.on("update-lobby", (name: string) => {
    if (title) {
      title.innerHTML = `Welcome ${name}`;
    }
  });
});
