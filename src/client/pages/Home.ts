import { EVENTS } from "@/shared/Events";
import { UIManager } from "../core/UIManager";
import { WebSocketClient } from "../core/WebSocketClient";

/**
 * Página Home - Lógica específica de la página principal
 */
class HomePage extends UIManager {
  private ws: WebSocketClient;

  constructor() {
    super();
    this.ws = new WebSocketClient();
    this.init();
  }

  private init(): void {
    this.setupWebSocketHandlers();
    this.setupUIHandlers();
  }

  private setupWebSocketHandlers(): void {
    // Conexión establecida
    this.ws.on("_connected", () => {
      this.updateConnectionStatus("connected", "Conectando...");
    });

    // Datos de conexión recibidos
    this.ws.on(EVENTS.CONNECTED, (data) => {
      this.updateConnectionStatus(
        "connected",
        `Conectado como ${data.username}`
      );
      this.updatePlayerInfo(data.username);
      this.addDebugMessage(`✅ Conectado como ${data.username}`);
    });

    // Batalla iniciada
    this.ws.on(EVENTS.START_BATTLE, (data) => {
      this.addDebugMessage(`⚔️ Batalla iniciada! ID: ${data.battleId}`);
    });

    // Desconexión
    this.ws.on("_disconnected", () => {
      this.updateConnectionStatus("disconnected", "Desconectado");
      this.addDebugMessage("❌ Conexión cerrada");
    });

    // Error
    this.ws.on("_error", () => {
      this.updateConnectionStatus("disconnected", "Error de conexión");
      this.addDebugMessage("❌ Error en la conexión");
    });
  }

  private setupUIHandlers(): void {
    // Botón de prueba
    this.onClick("test-btn", () => this.handleTestButton());
    this.onClick("start-btn", () => this.handleStartButton());
  }

  private handleTestButton(): void {
    if (!this.ws.isConnected) {
      this.addDebugMessage("⚠️ WebSocket no está conectado");
      return;
    }

    this.ws.send(EVENTS.START_BATTLE, { level: 1 });
    this.addDebugMessage("🧪 Mensaje de prueba enviado");
  }

  private handleStartButton(): void {
    if (!this.ws.isConnected) {
      this.addDebugMessage("⚠️ WebSocket no está conectado");
      return;
    }

    this.ws.send(EVENTS.JOIN_BATTLE, { id: this.ws.playerId });
    this.addDebugMessage(`⚔️ ${this.ws.username} se ha unido a la batalla`);
  }

  private updateConnectionStatus(
    status: "connected" | "disconnected",
    text: string
  ): void {
    const statusBox = this.getElement("connection-status");
    if (statusBox) {
      statusBox.className = `status-box ${status}`;
    }
    this.updateText("status-text", text);
  }

  private updatePlayerInfo(username: string): void {
    this.updateText("player-info", `👤 ${username}`);
  }

  private addDebugMessage(text: string): void {
    const messagesDiv = this.getElement("messages");
    if (!messagesDiv) return;

    const timestamp = new Date().toLocaleTimeString();
    const messageEl = this.createElement(
      "div",
      "message",
      `${timestamp} - ${text}`
    );

    this.prepend("messages", messageEl);

    // Limitar a 20 mensajes
    while (messagesDiv.children.length > 20) {
      messagesDiv.removeChild(messagesDiv.lastChild!);
    }
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new HomePage());
} else {
  new HomePage();
}
