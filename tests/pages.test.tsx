// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub, type LoaderFunctionArgs } from "react-router";
import { afterEach, expect, test } from "vitest";
import { getAbout, getExperience } from "@/entities/profile";
import { PAGE_IDS } from "@/shared/routing";
import { setTheme } from "@/shared/theme";
import { findRoute, routeModule, stubRoutes } from "./route-modules";

afterEach(() => {
  cleanup();
  // The Theme is module state, so a test that switches it must not leak it.
  setTheme("light");
});

function renderPath(path: string) {
  const Stub = createRoutesStub(stubRoutes());
  render(<Stub initialEntries={[path]} />);
}

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

async function findAboutSection(language: "en" | "ru") {
  renderPath(`/${language}/`);
  const heading = await screen.findByRole("heading", { level: 1, name: getAbout(language).name });
  return heading.closest("section") as HTMLElement;
}

test("the About Section shows the Stack as a list, in order", async () => {
  const section = await findAboutSection("en");
  const stack = within(section).getByRole("list", { name: "" });
  const items = within(stack)
    .getAllByRole("listitem")
    .map((item) => item.textContent);
  expect(items).toEqual(getAbout("en").stack);
});

test("every view of the Technologies is a list named Технологии of every Technology, once and in order", async () => {
  const section = await findAboutSection("ru");
  const views = within(section).getAllByRole("list", { name: "Технологии" });
  expect(views.length).toBeGreaterThan(0);
  for (const view of views) {
    const names = within(view)
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(names).toEqual(getAbout("ru").technologies.map((technology) => technology.name));
  }
});

async function findTechnologyViews() {
  const section = await findAboutSection("en");
  return within(section).getAllByRole("list", { name: "Technologies" });
}

function keyboardReachable(element: HTMLElement) {
  return element.tabIndex >= 0 && element.closest("[inert]") === null;
}

test("in every view, a linked Technology is a link the keyboard reaches, opening its website in a new tab", async () => {
  const linked = getAbout("en").technologies.filter((technology) => technology.url !== null);
  for (const view of await findTechnologyViews()) {
    const links = within(view)
      .getAllByRole("link")
      .map((link) => ({
        name: link.textContent,
        href: link.getAttribute("href"),
        target: link.getAttribute("target"),
        rel: link.getAttribute("rel"),
        reachable: keyboardReachable(link),
      }));
    expect(links).toEqual(
      linked.map(({ name, url }) => ({ name, href: url, target: "_blank", rel: "noopener", reachable: true })),
    );
  }
});

test("the About Section holds two views of the Technologies: the Technology Cloud and the Technology Marquee", async () => {
  expect(await findTechnologyViews()).toHaveLength(2);
});

test("the keyboard reaches each linked Technology once per view, never in the Technology Marquee's repeats", async () => {
  const section = await findAboutSection("en");
  const reachable = Array.from(section.querySelectorAll("a"))
    .filter(keyboardReachable)
    .map((link) => link.textContent);
  for (const { name, url } of getAbout("en").technologies) {
    expect(reachable.filter((text) => text === name)).toHaveLength(url === null ? 0 : 2);
  }
});

test("clicking a Technology in any view doesn't focus it", async () => {
  for (const view of await findTechnologyViews()) {
    const [link] = within(view).getAllByRole("link");
    const focusAllowed = fireEvent.mouseDown(link as HTMLElement);
    expect(focusAllowed).toBe(false);
  }
});

function paragraphsUnder(heading: HTMLElement) {
  const section = heading.closest("section") as HTMLElement;
  return Array.from(section.querySelectorAll("p"), (paragraph) => paragraph.textContent);
}

test("the About Page shows the Introduction under its h1, then the Bio, and no Technologies", async () => {
  renderPath("/ru/about");
  const about = getAbout("ru");
  const introduction = await screen.findByRole("heading", { level: 1, name: "Обо мне" });
  expect(paragraphsUnder(introduction)).toEqual(about.introduction);
  const bio = screen.getByRole("heading", { level: 2, name: "Биография" });
  expect(paragraphsUnder(bio)).toEqual(about.bio);
  expect(within(screen.getByRole("main")).queryAllByRole("heading", { level: 2 })).toEqual([bio]);
  expect(within(screen.getByRole("main")).queryByText(about.technologies[0]?.name ?? "")).toBeNull();
});

test.each(["en", "ru"] as const)(
  "the About Page in %s shows the Portrait, described by the owner's name",
  async (language) => {
    renderPath(`/${language}/about`);
    const portrait = await within(await screen.findByRole("main")).findByRole("img", { name: getAbout(language).name });
    expect(portrait.getAttribute("src")).toBe(getAbout(language).portrait);
  },
);

test.each(PAGE_IDS.filter((pageId) => pageId !== "about"))(
  "the %s Page's loader leaves out the Introduction, the Bio and the Portrait",
  (pageId) => {
    const { loader } = routeModule(findRoute(`en/${pageId}`));
    const request = new Request(`https://example.com/en/${pageId}`);
    const { about } = loader?.({ request, params: {}, context: {} } as LoaderFunctionArgs) as { about: object };
    for (const field of ["introduction", "bio", "portrait"]) {
      expect(about).not.toHaveProperty(field);
    }
  },
);

test("shows only Featured Entries on the Home Page, with links to their Topic Pages", async () => {
  renderPath("/en/");
  const section = (await screen.findByRole("heading", { level: 2, name: "Experience" })).closest("section");
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);
  const entries = scope.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
  expect(entries).toEqual(
    getExperience("en")
      .filter((entry) => entry.featured)
      .map((entry) => entry.role),
  );
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
  ["/en/about", "About Me"],
  ["/en/experience", "Experience"],
  ["/en/projects", "Projects"],
  ["/en/learning", "Learning"],
  ["/en/resume", "Resume"],
])("renders %s", async (path, heading) => {
  renderPath(path);
  expect(await screen.findByRole("heading", { level: 1, name: heading })).toBeDefined();
});

test("the Experience Page shows every Entry but Hidden ones, newest first", async () => {
  renderPath("/en/experience");
  await screen.findByRole("heading", { level: 1, name: "Experience" });
  const entries = within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(entries).toEqual(getExperience("en").map((entry) => `${entry.role} · ${entry.organisation}`));
});

test("the Experience Page shows each Assignment's lists under their labels, leaving out empty ones", async () => {
  renderPath("/ru/experience");
  await screen.findByRole("heading", { level: 1, name: "Опыт" });
  const labels = { responsibilities: "Обязанности", achievements: "Достижения", team: "Команда", tools: "Технологии" };
  const lists = Object.keys(labels) as (keyof typeof labels)[];
  const assignments = getExperience("ru").flatMap((entry) => entry.assignments);
  const headings = within(screen.getByRole("main")).getAllByRole("heading", { level: 3 });
  expect(
    headings.map((heading) => ({
      name: heading.textContent,
      lists: within(heading.parentElement as HTMLElement)
        .getAllByRole("heading", { level: 4 })
        .map((list) => list.textContent),
    })),
  ).toEqual(
    assignments.map((assignment) => ({
      name: assignment.name,
      lists: lists.filter((list) => assignment[list].length > 0).map((list) => labels[list]),
    })),
  );
});

async function findFeaturedExperience(language: "en" | "ru", heading: string) {
  renderPath(`/${language}/`);
  const section = (await screen.findByRole("heading", { level: 2, name: heading })).closest("section") as HTMLElement;
  const items = within(section)
    .getAllByRole("heading", { level: 3 })
    .map((entry) => entry.closest("li") as HTMLElement);
  return { section, items, entries: getExperience(language).filter((entry) => entry.featured) };
}

test.each([
  ["en", "Experience"],
  ["ru", "Опыт"],
] as const)(
  "in %s the Experience Section shows each Featured Entry by role, organisation, Location and Period, in order",
  async (language, heading) => {
    const { items, entries } = await findFeaturedExperience(language, heading);
    expect(items).toHaveLength(entries.length);
    entries.forEach((entry, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByRole("heading", { level: 3 }).textContent).toBe(entry.role);
      expect(item.getByText(entry.organisation)).toBeDefined();
      expect(item.getByText(entry.location)).toBeDefined();
      expect(item.getByText((text) => text.includes(entry.start.slice(0, 4)) && text.includes("–"))).toBeDefined();
    });
  },
);

test.each([
  ["en", "Experience", "Technologies"],
  ["ru", "Опыт", "Технологии"],
] as const)(
  "in %s the Experience Section shows each Assignment by name, description and every Tool, and nothing more",
  async (language, heading, toolsLabel) => {
    const { section, items, entries } = await findFeaturedExperience(language, heading);
    entries.forEach((entry, index) => {
      const names = within(items[index] as HTMLElement).getAllByRole("heading", { level: 4 });
      expect(names.map((name) => name.textContent)).toEqual(entry.assignments.map((assignment) => assignment.name));
      entry.assignments.forEach(({ description, tools }, position) => {
        const assignment = within(names[position]?.closest("li") as HTMLElement);
        expect(assignment.getByText(description)).toBeDefined();
        const chips = within(assignment.getByRole("list", { name: toolsLabel })).getAllByRole("listitem");
        expect(chips.map((chip) => chip.textContent)).toEqual(tools);
      });
    });
    const scope = within(section);
    for (const assignment of entries.flatMap((entry) => entry.assignments)) {
      for (const hidden of [...assignment.responsibilities, ...assignment.achievements, ...assignment.team]) {
        expect(scope.queryByText(hidden)).toBeNull();
      }
    }
  },
);

test.each([
  ["en", "Experience", "(opens in a new tab)"],
  ["ru", "Опыт", "(откроется в новой вкладке)"],
] as const)(
  "in %s a Featured Entry links its organisation, with an icon, to its website in a new tab, and saying so",
  async (language, heading, newTab) => {
    const { items, entries } = await findFeaturedExperience(language, heading);
    const links = items
      .flatMap((item) => within(item).queryAllByRole("link"))
      .map((link) => ({
        name: link.textContent,
        href: link.getAttribute("href"),
        target: link.getAttribute("target"),
        rel: link.getAttribute("rel"),
        icon: link.querySelector("svg") !== null,
      }));
    expect(links).toEqual(
      entries
        .filter((entry) => entry.url !== null)
        .map(({ organisation, url }) => ({
          name: `${organisation} ${newTab}`,
          href: url,
          target: "_blank",
          rel: "noopener",
          icon: true,
        })),
    );
  },
);

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
  expect(footer.getByRole("link", { name: /^GitHub/ }).getAttribute("href")).toBe("https://github.com/4edorov");
});

test.each([
  ["/en/", "Experience", "Contact", "Let's connect"],
  ["/ru/", "Опыт", "Контакты", "Давайте познакомимся"],
])(
  "on %s the Contact Section is headed like every Section, with an invitation under it",
  async (path, section, heading, invitation) => {
    renderPath(path);
    const sectionHeading = await screen.findByRole("heading", { level: 2, name: section });
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByRole("heading", { level: 2, name: heading }).className).toBe(sectionHeading.className);
    expect(footer.getByText(invitation).tagName).toBe("P");
  },
);

test.each([
  ["/en/", "Email me", "https://www.linkedin.com/in/alexander-fedorov-229008156/", "(opens in a new tab)"],
  [
    "/ru/",
    "Написать мне",
    "https://www.linkedin.com/in/alexander-fedorov-229008156/?locale=ru-RU",
    "(откроется в новой вкладке)",
  ],
])(
  "on %s the Contact Section links to email, GitHub and LinkedIn, opening the last two in a new tab and saying so",
  async (path, email, linkedIn, newTab) => {
    renderPath(path);
    const links = within(await screen.findByRole("contentinfo"))
      .getAllByRole("link")
      .map((link) => ({
        name: link.textContent,
        href: link.getAttribute("href"),
        target: link.getAttribute("target"),
        rel: link.getAttribute("rel"),
      }));
    expect(links).toEqual([
      { name: email, href: "mailto:4edorov@gmail.com", target: null, rel: null },
      { name: `GitHub ${newTab}`, href: "https://github.com/4edorov", target: "_blank", rel: "noopener" },
      { name: `LinkedIn ${newTab}`, href: linkedIn, target: "_blank", rel: "noopener" },
    ]);
  },
);

test.each([
  ["/en/", "Open to work"],
  ["/ru/", "Открыт к предложениям"],
])(
  "on %s the Contact Section says the owner is Open to Work and shows the email address as text",
  async (path, openToWork) => {
    renderPath(path);
    const footer = within(await screen.findByRole("contentinfo"));
    expect(footer.getByText(openToWork)).toBeDefined();
    expect(footer.getByText("4edorov@gmail.com").closest("a")).toBeNull();
  },
);

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
