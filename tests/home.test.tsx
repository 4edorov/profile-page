// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, expect, test } from "vitest";
import { getProfile } from "../app/content";
import { LANGUAGES } from "../app/languages";
import Home from "../app/routes/home";
import LanguageLayout from "../app/routes/language";
import NotFoundPage from "../app/routes/not-found";

afterEach(cleanup);

// Mirrors app/routes.ts: one route tree per Language plus a top-level 404.
function renderPath(path: string) {
  const Stub = createRoutesStub([
    ...LANGUAGES.map((language) => ({
      path: `/${language}`,
      Component: LanguageLayout,
      children: [
        {
          index: true,
          Component: Home as React.ComponentType,
          loader: () => ({ language, profile: getProfile(language) }),
        },
        { path: "*", Component: NotFoundPage },
      ],
    })),
    { path: "*", Component: NotFoundPage },
  ]);
  render(<Stub initialEntries={[path]} />);
}

test("renders the Russian home Page with Russian UI Strings and a link to English", async () => {
  renderPath("/ru/");
  expect(await screen.findByRole("heading", { level: 1, name: getProfile("ru").name })).toBeDefined();
  expect(screen.getByRole("heading", { level: 2, name: "Я в сети" })).toBeDefined();
  expect(screen.getByRole("link", { name: "English" }).getAttribute("href")).toBe("/en/");
});

test("renders the Russian 404 for an unknown Russian path", async () => {
  renderPath("/ru/nope");
  expect(await screen.findByRole("heading", { name: "Страница не найдена" })).toBeDefined();
});

test("renders the English 404 for an unknown Language", async () => {
  renderPath("/de/");
  expect(await screen.findByRole("heading", { name: "Page not found" })).toBeDefined();
});
