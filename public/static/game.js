// Clase para manejar el cliente WebSocket
class GameClient {
  constructor() {
    this.socket = null;
    this.playerId = null;
    this.username = null;
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.setupUI();
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.addEventListener('open', () => this.onOpen());
    this.socket.addEventListener('message', (e) => this.onMessage(e));
    this.socket.addEventListener('close', () => this.onClose());
    this.socket.addEventListener('error', (e) => this.onError(e));
  }

  setupUI() {
    const testBtn = document.getElementById('test-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.testConnection());
    }
  }

  onOpen() {
    console.log('✅ WebSocket conectado');
    this.updateStatus('connected', 'Conectado al servidor');
    this.addMessage('✅ Conexión establecida');
  }

  onMessage(event) {
    const msg = JSON.parse(event.data);
    console.log('📨 Mensaje:', msg);

    switch(msg.type) {
      case 'CONNECTED':
        this.playerId = msg.data.id;
        this.username = msg.data.username;
        this.updateStatus('connected', `Conectado como ${msg.data.username}`);
        this.updatePlayerInfo(msg.data.username);
        this.addMessage(`✅ Conectado como ${msg.data.username}`);
        break;

      case 'START_BATTLE':
        this.addMessage(`⚔️ Batalla iniciada! ID: ${msg.data.battleId}`);
        break;

      default:
        this.addMessage(`📨 ${msg.type}: ${JSON.stringify(msg.data)}`);
    }
  }

  onClose() {
    console.log('❌ WebSocket desconectado');
    this.updateStatus('disconnected', 'Desconectado');
    this.addMessage('❌ Conexión cerrada');
  }

  onError(error) {
    console.error('❌ Error:', error);
    this.updateStatus('disconnected', 'Error de conexión');
    this.addMessage('❌ Error en la conexión');
  }

  testConnection() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send('START_BATTLE', { level: 1 });
      this.addMessage('🧪 Mensaje de prueba enviado');
    } else {
      this.addMessage('⚠️ WebSocket no está conectado');
    }
  }

  send(type, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    }
  }

  updateStatus(status, text) {
    const statusBox = document.getElementById('connection-status');
    const statusText = document.getElementById('status-text');
    
    if (statusBox) {
      statusBox.className = `status-box ${status}`;
    }
    
    if (statusText) {
      statusText.textContent = text;
    }
  }

  updatePlayerInfo(username) {
    const playerInfo = document.getElementById('player-info');
    if (playerInfo) {
      playerInfo.textContent = `👤 ${username}`;
    }
  }

  addMessage(text) {
    const messagesDiv = document.getElementById('messages');
    if (!messagesDiv) return;

    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
    
    messagesDiv.insertBefore(messageEl, messagesDiv.firstChild);

    // Limitar a 20 mensajes
    while (messagesDiv.children.length > 20) {
      messagesDiv.removeChild(messagesDiv.lastChild);
    }
  }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  window.gameClient = new GameClient();
});