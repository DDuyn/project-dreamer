import { EVENTS } from "@/shared/Events";
import { Socket } from "./websocket/Socket";

const socketClient = new Socket("ws://localhost:3000");

socketClient.on(EVENTS.CONNECTED, (data) => {
  console.log("Cliente conectado:", data);
});

socketClient.on(EVENTS.START_BATTLE, (data) => {
  console.log("Comienza la batalla!", data);
});

setTimeout(() => {
  socketClient.send(EVENTS.START_BATTLE, { level: 1 });
}, 2000);
