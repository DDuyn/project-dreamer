import type { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const HomePage: FC = () => {
  return (
    <Layout title="Battle Game - Home">
      <div class="container">
        <div class="welcome-card">
          <h2>🎮 Bienvenido a Battle Game</h2>
          <p class="subtitle">Sistema de batalla por turnos estilo Pokémon</p>

          <div id="connection-status" class="status-box">
            <span class="status-indicator"></span>
            <span id="status-text">Conectando...</span>
          </div>

          <div class="actions">
            <button id="test-btn" class="btn btn-primary">
              🧪 Probar Conexión
            </button>
            <button id="start-btn" class="btn btn-primary">
              Unirse a Batalla
            </button>
          </div>

          <div id="debug-info" class="debug-info">
            <h3>🔍 Debug Info</h3>
            <div id="messages"></div>
          </div>
        </div>
      </div>

      {/* Script específico de esta página */}
      <script type="module" src="/static/js/home.js"></script>
    </Layout>
  );
};
