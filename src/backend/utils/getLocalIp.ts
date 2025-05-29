import os from "os";

export function getLocalIp(): string | null {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
            if (net.family === "IPv4" && !net.internal){
                return net.address
            }
        }
    }
    return null;
}