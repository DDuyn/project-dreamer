import type { ServerWebSocket } from "bun";
import type { Events } from "./Events";

export interface WSMessage<T = any> {
  type: Events;
  data: T;
}

export type ServerHandler = (
  ws: ServerWebSocket<PlayerSession>,
  data: any
) => void;

export interface PlayerSession {
  id: string;
  username: string;
  battleId: string | null;
}

export interface Battle {
  id: string;
  players: PlayerSession[];
}
