import { EVENTS } from "@/shared/Events";
import type { PlayerSession } from "@/shared/WSMessage";
import type { ServerWebSocket } from "bun";

export class StartBattle {
  static async handle(ws: ServerWebSocket<PlayerSession>, data: any) {
    console.log("Comienza la batalla!", data);
    ws.send(
      JSON.stringify({
        type: EVENTS.START_BATTLE,
        data: {
          battleId: crypto.randomUUID(),
          id: ws.data.id,
          username: ws.data.username,
        },
      })
    );
  }
}
