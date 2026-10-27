import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { NotFound } from "@/pages/not-found";
import { useLanguage } from "@/shared/i18n";
import { Frame } from "./layouts/frame";
import "./app.css";

export const links: Route.LinksFunction = () => [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }];

export function Layout({ children }: { children: React.ReactNode }) {
  const language = useLanguage();
  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-text antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const language = useLanguage();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Frame language={language}>
        <NotFound language={language} />
      </Frame>
    );
  }
  if (import.meta.env.DEV) {
    console.error(error);
  }
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
    </main>
  );
}
