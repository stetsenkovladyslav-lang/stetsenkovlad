// npm install ws
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let clients = new Map(); // ws → name

wss.on("connection", (ws) => {
  let username = "Анонім";

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === "setName") {
        username = data.name || "Анонім";
        clients.set(ws, username);
        broadcast();
      }
    } catch (e) {
      console.error("Помилка повідомлення:", e);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcast();
  });
});

function broadcast() {
  const onlineUsers = Array.from(clients.values());
  const message = JSON.stringify({ type: "onlineList", users: onlineUsers });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

console.log("✅ Сервер запущено на ws://localhost:8080");
