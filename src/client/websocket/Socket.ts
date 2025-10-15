import type { WSMessage } from "@/shared/WSMessage";
import type { WebSocket } from "bun";

type EventHandler = (msg: WSMessage) => void;

export class Socket {
  private socket: WebSocket;
  private handlers: Record<string, EventHandler[]> = {};

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      this.dispatch(msg.type, msg.data);
    });

    this.socket.addEventListener("open", () => {
      console.log("WebSocket conectado");
    });

    this.socket.addEventListener("close", () => {
      console.log("WebSocket desconectado");
    });
  }

  on(eventType: string, handler: EventHandler) {
    if (!this.handlers[eventType]) this.handlers[eventType] = [];
    this.handlers[eventType].push(handler);
  }

  send(eventType: string, data: any) {
    this.socket.send(JSON.stringify({ type: eventType, data }));
  }

  private dispatch(eventType: string, data: any) {
    const handlers = this.handlers[eventType];
    if (handlers) {
      handlers.forEach((h) => h(data));
    } else {
      console.warn(`⚠️ No handler for event ${eventType}`);
    }
  }
}
