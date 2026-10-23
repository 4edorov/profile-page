// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { createRoutesStub, type LoaderFunctionArgs } from "react-router";
import { afterEach, expect, test } from "vitest";
import LanguageLayout from "@/app/routes/language";
import { getAbout } from "@/entities/profile";
import * as about from "@/pages/about/ui/page";
import * as experience from "@/pages/experience/ui/page";
import * as home from "@/pages/home/ui/page";
import * as learning from "@/pages/learning/ui/page";
import NotFoundPage from "@/pages/not-found/ui/page";
import * as projects from "@/pages/projects/ui/page";
import * as resume from "@/pages/resume/ui/page";
import { LANGUAGES } from "@/shared/i18n";
import { PAGE_IDS, PAGE_PATHS, type PageId } from "@/shared/routing";

afterEach(cleanup);

interface PageModule {
  loader: (args: LoaderFunctionArgs) => unknown;
  default: React.ComponentType;
}

const MODULES: Record<PageId, PageModule> = {
  home: home as unknown as PageModule,
  about: about as unknown as PageModule,
  experience: experience as unknown as PageModule,
  projects: projects as unknown as PageModule,
  learning: learning as unknown as PageModule,
  resume: resume as unknown as PageModule,
};

// Mirrors src/app/routes.ts: one route tree per Language plus a top-level 404.
function renderPath(path: string) {
  const Stub = createRoutesStub([
    ...LANGUAGES.map((language) => ({
      path: `/${language}`,
      Component: LanguageLayout,
      children: [
        ...PAGE_IDS.map((id) => ({
          ...(PAGE_PATHS[id] ? { path: PAGE_PATHS[id] } : { index: true as const }),
          Component: MODULES[id].default,
          loader: (args: LoaderFunctionArgs) => MODULES[id].loader(args),
        })),
        { path: "*", Component: NotFoundPage },
      ],
    })),
    { path: "*", Component: NotFoundPage },
  ]);
  render(<Stub initialEntries={[path]} />);
}

test("renders the Russian Home Page with every Topic's Section and a link to English", async () => {
  renderPath("/ru/");
  expect(await screen.findByRole("heading", { level: 1, name: getAbout("ru").name })).toBeDefined();
  const sections = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
  expect(sections).toEqual(["Опыт", "Проекты", "Обучение", "Контакты"]);
  expect(screen.getByRole("link", { name: "English" }).getAttribute("href")).toBe("/en/");
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
  const entries = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
  expect(entries).toEqual(["Placeholder role · Current Company", "Placeholder role · Previous Company"]);
});

test("the Learning Page groups Entries by kind", async () => {
  renderPath("/ru/learning");
  await screen.findByRole("heading", { level: 1, name: "Обучение" });
  const groups = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
  expect(groups).toEqual(["Образование", "Курсы", "Сертификаты", "Книги"]);
});

test("switching Language keeps the Page", async () => {
  renderPath("/ru/experience");
  expect((await screen.findByRole("link", { name: "English" })).getAttribute("href")).toBe("/en/experience");
});

test("renders the Russian 404 for an unknown Russian path", async () => {
  renderPath("/ru/nope");
  expect(await screen.findByRole("heading", { name: "Страница не найдена" })).toBeDefined();
});

test("renders the English 404 for an unknown Language", async () => {
  renderPath("/de/");
  expect(await screen.findByRole("heading", { name: "Page not found" })).toBeDefined();
});
