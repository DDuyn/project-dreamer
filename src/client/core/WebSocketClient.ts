import { EVENTS, type Events } from "@/shared/Events";
import type { WSMessage } from "@/shared/WSMessage";

type MessageHandler = (data: any) => void;

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  public playerId: string | null = null;
  public username: string | null = null;
  public isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.addEventListener("open", () => this.onOpen());
    this.socket.addEventListener("message", (e) => this.onMessage(e));
    this.socket.addEventListener("close", () => this.onClose());
    this.socket.addEventListener("error", (e) => this.onError(e));
  }

  private onOpen(): void {
    this.isConnected = true;
    console.log("✅ WebSocket conectado");
    this.emit("_connected", {});
  }

  private onMessage(event: MessageEvent): void {
    try {
      const msg: WSMessage = JSON.parse(event.data);
      console.log("📨 Mensaje recibido:", msg);

      // Manejar eventos especiales del sistema
      if (msg.type === EVENTS.CONNECTED) {
        this.playerId = msg.data.id;
        this.username = msg.data.username;
      }

      // Emitir a los handlers registrados
      this.emit(msg.type, msg.data);
    } catch (error) {
      console.error("Error procesando mensaje:", error);
    }
  }

  private onClose(): void {
    this.isConnected = false;
    console.log("❌ WebSocket desconectado");
    this.emit("_disconnected", {});
  }

  private onError(error: Event): void {
    console.error("❌ WebSocket error:", error);
    this.emit("_error", error);
  }

  /**
   * Registrar un handler para un tipo de evento
   */
  public on(eventType: string, handler: MessageHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  /**
   * Eliminar un handler
   */
  public off(eventType: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Enviar un mensaje al servidor
   */
  public send(eventType: string, data: any = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket no está conectado");
      return;
    }

    const message: WSMessage = {
      type: eventType as Events,
      data,
    };

    this.socket.send(JSON.stringify(message));
    console.log("📤 Mensaje enviado:", message);
  }

  /**
   * Emitir un evento a los handlers registrados
   */
  private emit(eventType: string, data: any): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  /**
   * Cerrar la conexión
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Reconectar
   */
  public reconnect(): void {
    this.disconnect();
    this.connect();
  }
}
