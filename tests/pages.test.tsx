// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, expect, test } from "vitest";
import { getAbout } from "@/entities/profile";
import { setTheme } from "@/shared/theme";
import { stubRoutes } from "./route-modules";

afterEach(() => {
  cleanup();
  // The Theme is module state, so a test that switches it must not leak it.
  setTheme("light");
});

// The real route tree of src/app/routes.ts, with each route's own module.
function renderPath(path: string) {
  const Stub = createRoutesStub(stubRoutes());
  render(<Stub initialEntries={[path]} />);
}

/** Queries the Header itself, not the mobile menu that repeats its controls. */
async function findInHeader(...args: Parameters<typeof screen.getByRole>) {
  return within(await screen.findByRole("banner")).getByRole(...args);
}

test("renders the Russian Home Page with every Topic's Section except Contact, and a link to English", async () => {
  renderPath("/ru/");
  expect(await screen.findByRole("heading", { level: 1, name: getAbout("ru").name })).toBeDefined();
  const sections = within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(sections).toEqual(["Опыт", "Проекты", "Обучение"]);
  expect((await findInHeader("link", { name: /English/ })).getAttribute("href")).toBe("/en/");
});

test("shows only Featured Entries on the Home Page, with links to their Topic Pages", async () => {
  renderPath("/en/");
  const section = (await screen.findByRole("heading", { level: 2, name: "Experience" })).closest("section");
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);
  expect(scope.getByText(/Current Company/)).toBeDefined();
  expect(scope.queryByText(/Previous Company/)).toBeNull();
  expect(scope.getByRole("link", { name: "All experience" }).getAttribute("href")).toBe("/en/experience");
});

test("the Header links to every Page in order and marks the current one", async () => {
  renderPath("/en/projects");
  const nav = await screen.findByRole("navigation", { name: "Pages" });
  const links = within(nav).getAllByRole("link");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "/en/",
    "/en/about",
    "/en/experience",
    "/en/projects",
    "/en/learning",
    "/en/resume",
  ]);
  expect(within(nav).getByRole("link", { current: "page" }).textContent).toBe("Projects");
});

test.each([
  ["/en/about", "About"],
  ["/en/experience", "Experience"],
  ["/en/projects", "Projects"],
  ["/en/learning", "Learning"],
  ["/en/resume", "Resume"],
])("renders %s", async (path, heading) => {
  renderPath(path);
  expect(await screen.findByRole("heading", { level: 1, name: heading })).toBeDefined();
});

test("the Experience Page shows every Entry, newest first", async () => {
  renderPath("/en/experience");
  await screen.findByRole("heading", { level: 1, name: "Experience" });
  const entries = within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(entries).toEqual(["Placeholder role · Current Company", "Placeholder role · Previous Company"]);
});

test("the Learning Page groups Entries by kind", async () => {
  renderPath("/ru/learning");
  await screen.findByRole("heading", { level: 1, name: "Обучение" });
  const groups = within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(groups).toEqual(["Образование", "Курсы", "Сертификаты", "Книги"]);
});

test("switching Language keeps the Page", async () => {
  renderPath("/ru/experience");
  expect((await findInHeader("link", { name: /English/ })).getAttribute("href")).toBe("/en/experience");
});

test("the Language switcher is a single link to the other Language, named by its visible code and full name", async () => {
  renderPath("/en/projects");
  expect(await findInHeader("link", { name: "RU Русский" })).toBeDefined();
  expect(within(screen.getByRole("banner")).queryByRole("link", { name: /English/ })).toBeNull();
});

test("the Theme starts in Light, and a switch lasts across Pages and Languages", async () => {
  renderPath("/en/");
  const html = document.documentElement;
  expect(html.dataset.theme).not.toBe("dark");

  fireEvent.click(await findInHeader("button", { name: "Switch to dark theme" }));
  expect(html.dataset.theme).toBe("dark");

  fireEvent.click(await findInHeader("link", { name: "Projects" }));
  await screen.findByRole("heading", { level: 1, name: "Projects" });
  fireEvent.click(await findInHeader("link", { name: /Русский/ }));
  await screen.findByRole("heading", { level: 1, name: "Проекты" });
  expect(html.dataset.theme).toBe("dark");

  fireEvent.click(await findInHeader("button", { name: "Включить светлую тему" }));
  expect(html.dataset.theme).toBe("light");
  expect(await findInHeader("button", { name: "Включить тёмную тему" })).toBeDefined();
});

test.each([
  ["/en/", "Contact"],
  ["/ru/learning", "Контакты"],
  ["/ru/nope", "Контакты"],
])("%s has a Footer holding the Contact Section", async (path, heading) => {
  renderPath(path);
  const footer = within(await screen.findByRole("contentinfo"));
  expect(footer.getByRole("heading", { name: heading })).toBeDefined();
  expect(footer.getByRole("link", { name: "GitHub" }).getAttribute("href")).toBe("https://github.com/4edorov");
});

test("renders the Russian 404 for an unknown Russian path", async () => {
  renderPath("/ru/nope");
  expect(await screen.findByRole("heading", { name: "Страница не найдена" })).toBeDefined();
});

test("renders the English 404 for an unknown Language", async () => {
  renderPath("/de/");
  expect(await screen.findByRole("heading", { name: "Page not found" })).toBeDefined();
});

test("the 404 outside any Language has the Header and Footer, switching to the Russian Home Page", async () => {
  renderPath("/de/projects");
  expect((await findInHeader("link", { name: /Русский/ })).getAttribute("href")).toBe("/ru/");
  expect(within(screen.getByRole("contentinfo")).getByRole("heading", { name: "Contact" })).toBeDefined();
});
