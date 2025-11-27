import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import styles from "./styles.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: styles }
  ];
}

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>{`Syed Raza | Figma To HTML & CSS Converter`}</h1>
        <div className="main-wrapper">
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
