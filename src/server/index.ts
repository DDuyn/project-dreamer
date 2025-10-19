import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import routes from "./routes";
import { websocket } from "./websocket";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./public" }));

app.route("/", routes);

const server = Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (req.headers.get("upgrade") === "websocket") {
      const success = server.upgrade(req, {
        data: {
          id: "",
          username: "",
          battleId: null,
        },
      });
      if (success) {
        return undefined;
      }
    }

    return app.fetch(req, server);
  },
  websocket: websocket,
});

console.log(`
╔════════════════════════════════════╗
║   🎮 BATTLE GAME SERVER - POC     ║
╚════════════════════════════════════╝

🚀 Server: http://${server.hostname}:${server.port}
🔌 WebSocket: ws://${server.hostname}:${server.port}

📝 Routes:
   GET  /              Home page
   WS   /              WebSocket connection

⚡ Ready!
`);
