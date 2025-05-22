import socket from "./socket.js";

document.addEventListener("DOMContentLoaded", () => {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>("button[data-page]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-page");
      if (page) showPage(page);
    });
  });

  socket.on("go-to-page", (page: string) => {
    if (page) showPage(page);
    socket.emit("get-page-updates", page);
  });
});

function showPage(pageId: string): void {
  const pages = document.querySelectorAll<HTMLElement>(".page");
  pages.forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");
}
