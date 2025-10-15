import { EVENTS } from "@/shared/Events";
import type {
  PlayerSession,
  ServerHandler,
  WSMessage,
} from "@/shared/WSMessage";
import type { ServerWebSocket } from "bun";
import { StartBattle } from "../handlers/StartBattle";

type ServerSocket = ServerWebSocket<PlayerSession> & {
  sendEvent: <T>(type: string, data: T) => void;
};

export const websocket = {
  open(ws: ServerSocket) {
    console.log("hola");
    connect(ws);
  },

  close(ws: ServerSocket) {
    console.log("Cliente desconectado:", ws.data.username);
  },

  message(ws: ServerSocket, raw: string | Uint8Array) {
    const text = typeof raw === "string" ? raw : Buffer.from(raw).toString();
    const msg: WSMessage = JSON.parse(text);

    console.log("Mensaje entrante:", msg);

    const handler = handlers[msg.type];

    if (handler) handler(ws, msg.data);
    else console.warn("Evento desconocido:", msg.type);
  },
};

const handlers: Record<string, ServerHandler> = {
  [EVENTS.START_BATTLE]: async (ws, data) => await StartBattle.handle(ws, data),
};

const connect = (ws: ServerSocket) => {
  ws.data = {
    id: crypto.randomUUID(),
    username: `Guest-${Math.floor(Math.random() * 1000)}`,
    battleId: null,
  };

  ws.sendEvent = function <T>(type: string, data: T) {
    this.send(JSON.stringify({ type, data }));
  };

  console.log("Cliente conectado:", ws.data.username);

  ws.sendEvent(EVENTS.CONNECTED, {
    id: ws.data.id,
    username: ws.data.username,
  });
};
