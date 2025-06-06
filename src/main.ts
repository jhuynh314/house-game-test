import { app, BrowserWindow, shell } from 'electron';
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
import { registerGameHandlers } from "./backend/gameHandlers.js";
import { getLocalIp } from "./backend/utils/getLocalIp.js";
import QRCode from 'qrcode';
import { createAnswerKey } from './index.js';
import { fileURLToPath } from "url";
import path from "path";


app.whenReady().then(() => {
    createWindow();
});

function startServer() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {},
    });

    app.use(express.static("./dist/ui"));
    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "./ui/index.html"));
    });

    createAnswerKey();

    io.on("connection", async (socket: any) => {
        registerGameHandlers(io, socket);

        const ip = getLocalIp();
        const url = `http://${ip}:3000`;
        const dataUrl = await QRCode.toDataURL(url);
        io.emit("update-qr-code", dataUrl);
    });

    server.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL("http://localhost:3000");
}
