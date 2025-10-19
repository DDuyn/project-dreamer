import type { FC } from "hono/jsx";

type LayoutProps = {
  title?: string;
  children: any;
};

export const Layout: FC<LayoutProps> = ({
  title = "Battle Game",
  children,
}) => {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <nav class="navbar">
          <div class="nav-container">
            <h1 class="logo">⚔️ Battle Game</h1>
            <div id="player-info" class="player-info"></div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
};
