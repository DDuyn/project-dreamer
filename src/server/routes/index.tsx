import { Hono } from "hono";
import { HomePage } from "../views/Home";

const routes = new Hono();

// Ruta principal
routes.get("/", (c) => {
  return c.html(<HomePage />);
});

// Puedes añadir más rutas aquí fácilmente
// routes.get('/battle', (c) => c.html(<BattlePage />));
// routes.get('/stats', (c) => c.html(<StatsPage />));

export default routes;
