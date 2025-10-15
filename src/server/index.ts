import { websocket } from "./websocket";

const server = Bun.serve({
  port: 3000,
  fetch(req, server) {
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
    return new Response("Hello world!");
  },
  websocket: websocket,
});

console.log(`Listening on ${server.hostname}:${server.port}`);
