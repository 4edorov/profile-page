// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub, type LoaderFunctionArgs } from "react-router";
import { afterEach, expect, test } from "vitest";
import {
  type Assignment,
  getAbout,
  getExperience,
  getLearning,
  getProjects,
  type ProjectEntry,
} from "@/entities/profile";
import { PAGE_IDS } from "@/shared/routing";
import { setTheme } from "@/shared/theme";
import "./dialog-shim";
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

const PERIODS = {
  en: [
    "Jan 2025 – Sep 2026",
    "Feb 2023 – Dec 2024",
    "May 2021 – Jan 2023",
    "Dec 2019 – Apr 2021",
    "Oct 2019 – May 2020",
    "Apr 2017 – Sep 2019",
  ],
  ru: [
    "янв. 2025 – сент. 2026",
    "февр. 2023 – дек. 2024",
    "май 2021 – янв. 2023",
    "дек. 2019 – апр. 2021",
    "окт. 2019 – май 2020",
    "апр. 2017 – сент. 2019",
  ],
} as const;

const EXPERIENCE_HEADINGS = [
  ["en", "Experience"],
  ["ru", "Опыт"],
] as const;

const TOPIC_ON = {
  Section: { titleLevel: 2, container: "section", featuredOnly: true },
  Page: { titleLevel: 1, container: "main", featuredOnly: false },
} as const;

async function findTopic(on: keyof typeof TOPIC_ON, topic: string, language: "en" | "ru", heading: string) {
  const { titleLevel, container, featuredOnly } = TOPIC_ON[on];
  renderPath(`/${language}/${on === "Page" ? topic : ""}`);
  const title = await screen.findByRole("heading", { level: titleLevel, name: heading });
  return { scope: title.closest(container) as HTMLElement, level: titleLevel + 1, featuredOnly };
}

const EXPERIENCE_CASES = [
  ["Section", "en", "Experience", PERIODS.en.slice(0, 2)],
  ["Section", "ru", "Опыт", PERIODS.ru.slice(0, 2)],
  ["Page", "en", "Experience", PERIODS.en],
  ["Page", "ru", "Опыт", PERIODS.ru],
] as const;

async function findExperience(on: keyof typeof TOPIC_ON, language: "en" | "ru", heading: string) {
  const { scope, level, featuredOnly } = await findTopic(on, "experience", language, heading);
  const items = within(scope)
    .getAllByRole("heading", { level })
    .map((entry) => entry.closest("li") as HTMLElement);
  const entries = getExperience(language).filter((entry) => !featuredOnly || entry.featured);
  return { scope, items, level, entries };
}

function assignmentItems(entryItem: HTMLElement, level: number) {
  return within(entryItem)
    .getAllByRole("heading", { level: level + 1 })
    .map((name) => name.closest("li") as HTMLElement);
}

function detailsOf(assignment: Assignment) {
  return [...assignment.responsibilities, ...assignment.achievements, ...assignment.team];
}

test.each(EXPERIENCE_CASES)(
  "the Experience %s in %s shows its Entries on the Timeline by role, organisation, Location and Period, in order",
  async (on, language, heading, periods) => {
    const { items, level, entries } = await findExperience(on, language, heading);
    expect(items).toHaveLength(periods.length);
    entries.forEach((entry, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByRole("heading", { level, name: entry.role })).toBeDefined();
      expect(item.getByText(entry.organisation)).toBeDefined();
      expect(item.getByText(entry.location)).toBeDefined();
      expect(item.getByText(periods[index] as string)).toBeDefined();
    });
  },
);

const TOOLS_LABELS = { en: "Technologies", ru: "Технологии" } as const;

test.each(EXPERIENCE_CASES)(
  "the Experience %s in %s shows each Assignment by name, description and every Tool, with no inline lists",
  async (on, language, heading) => {
    const { scope, items, level, entries } = await findExperience(on, language, heading);
    entries.forEach((entry, index) => {
      const assignments = assignmentItems(items[index] as HTMLElement, level);
      expect(assignments.map((item) => within(item).getByRole("heading").textContent)).toEqual(
        entry.assignments.map((assignment) => assignment.name),
      );
      entry.assignments.forEach(({ description, tools: expectedTools }, position) => {
        const assignment = within(assignments[position] as HTMLElement);
        expect(assignment.getByText(description)).toBeDefined();
        const tools = within(assignment.getByRole("list", { name: TOOLS_LABELS[language] })).getAllByRole("listitem");
        expect(tools.map((tool) => tool.textContent)).toEqual(expectedTools);
      });
    });
    for (const detail of entries.flatMap((entry) => entry.assignments).flatMap(detailsOf)) {
      const inline = within(scope)
        .queryAllByText(detail)
        .filter((element) => element.closest("dialog") === null);
      expect(inline).toEqual([]);
    }
  },
);

const NEW_TAB = { en: "(opens in a new tab)", ru: "(откроется в новой вкладке)" } as const;

test.each(EXPERIENCE_CASES)(
  "on the Experience %s in %s, only an Entry with a URL links its organisation, with an icon, in a new tab, saying so",
  async (on, language, heading) => {
    const { items, entries } = await findExperience(on, language, heading);
    const newTab = NEW_TAB[language];
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

const DETAILS = { en: "Details", ru: "Подробнее" } as const;

test.each(EXPERIENCE_HEADINGS)(
  "the Experience Page in %s has a details button per Assignment, named after it",
  async (language, heading) => {
    const { scope, items, level, entries } = await findExperience("Page", language, heading);
    expect(within(scope).getAllByRole("button")).toHaveLength(entries.flatMap((entry) => entry.assignments).length);
    entries.forEach((entry, index) => {
      const assignments = assignmentItems(items[index] as HTMLElement, level);
      entry.assignments.forEach(({ name }, position) => {
        const button = within(assignments[position] as HTMLElement).getByRole("button", {
          name: (accessible) => accessible.includes(DETAILS[language]) && accessible.includes(name),
        });
        expect(button.textContent.startsWith(DETAILS[language])).toBe(true);
      });
    });
  },
);

test.each(EXPERIENCE_HEADINGS)("the Experience Section in %s has no details buttons", async (language, heading) => {
  const { scope } = await findExperience("Section", language, heading);
  expect(within(scope).queryAllByRole("button")).toEqual([]);
});

const DETAIL_LABELS = {
  en: { responsibilities: "Responsibilities", achievements: "Achievements", team: "Team", close: "Close" },
  ru: { responsibilities: "Обязанности", achievements: "Достижения", team: "Команда", close: "Закрыть" },
} as const;
const DETAIL_LISTS = ["responsibilities", "achievements", "team"] as const;

test.each(EXPERIENCE_HEADINGS)(
  "in %s a details button opens the Assignment Details, listing its non-empty lists under their labels, until closed",
  async (language, heading) => {
    const { items, entries } = await findExperience("Page", language, heading);
    const labels = DETAIL_LABELS[language];
    for (const [index, { organisation, assignments }] of entries.entries()) {
      const buttons = within(items[index] as HTMLElement).getAllByRole("button");
      for (const [position, assignment] of assignments.entries()) {
        fireEvent.click(buttons[position] as HTMLElement);
        const dialog = within(
          screen.getByRole("dialog", {
            name: (accessible) => accessible.includes(assignment.name) && accessible.includes(organisation),
          }),
        );
        const shown = DETAIL_LISTS.filter((list) => assignment[list].length > 0);
        expect(dialog.getAllByRole("heading", { level: 3 }).map((label) => label.textContent)).toEqual(
          shown.map((list) => labels[list]),
        );
        for (const list of shown) {
          const items = within(dialog.getByRole("list", { name: labels[list] })).getAllByRole("listitem");
          expect(items.map((item) => item.textContent)).toEqual(assignment[list]);
        }
        expect(dialog.queryByRole("list", { name: TOOLS_LABELS[language] })).toBeNull();
        fireEvent.click(dialog.getByRole("button", { name: labels.close }));
        expect(screen.queryByRole("dialog")).toBeNull();
      }
    }
  },
);

async function openFirstAssignmentDetails() {
  const { scope } = await findExperience("Page", "en", "Experience");
  const button = within(scope).getAllByRole("button")[0] as HTMLElement;
  fireEvent.click(button);
  return { button, dialog: screen.getByRole("dialog") };
}

test("closing an Assignment Details returns focus to the details button that opened it", async () => {
  const { button, dialog } = await openFirstAssignmentDetails();
  expect(document.activeElement).not.toBe(button);
  fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
  expect(document.activeElement).toBe(button);
});

test("an Assignment Details closes on a click on its backdrop, but not when the press started inside it", async () => {
  const { button, dialog } = await openFirstAssignmentDetails();
  fireEvent.pointerDown(within(dialog).getAllByRole("listitem")[0] as HTMLElement);
  fireEvent.click(dialog);
  expect(screen.getByRole("dialog")).toBe(dialog);
  fireEvent.pointerDown(dialog);
  fireEvent.click(dialog);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(button);
});

test("the Experience Page renders every Assignment Details before any is opened, hidden until then", async () => {
  const { scope, entries } = await findExperience("Page", "en", "Experience");
  expect(screen.queryAllByRole("dialog")).toEqual([]);
  for (const detail of entries.flatMap((entry) => entry.assignments).flatMap(detailsOf)) {
    const shown = within(scope).getAllByText(detail);
    expect(shown.every((element) => element.closest("dialog")?.open === false)).toBe(true);
  }
});

test("the Learning Page groups Entries by Learning Kind, without empty ones", async () => {
  renderPath("/ru/learning");
  await screen.findByRole("heading", { level: 1, name: "Обучение" });
  const groups = within(screen.getByRole("main"))
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(groups).toEqual(["Образование", "Сертификаты", "Книги"]);
});

const PROJECT_LINK_NAMES = {
  en: { visit: "Visit", source: "Source" },
  ru: { visit: "Открыть", source: "Исходный код" },
} as const;

function expectProjectEntries(scope: HTMLElement, language: "en" | "ru", entries: ProjectEntry[]) {
  const { visit, source } = PROJECT_LINK_NAMES[language];
  const rendered = within(scope)
    .getAllByRole("heading", { level: 3 })
    .map((name) => name.closest("li") as HTMLElement);
  expect(rendered.map((element) => within(element).getByRole("heading").textContent)).toEqual(
    entries.map((entry) => entry.name),
  );
  entries.forEach((entry, index) => {
    const shown = within(rendered[index] as HTMLElement);
    expect(shown.getByText(entry.summary)).toBeDefined();
    const liveSite = shown.queryByRole("link", { name: new RegExp(`^${visit} ${entry.name}`) });
    expect(liveSite?.getAttribute("href") ?? null).toBe(entry.url);
    const sourceLink = shown.queryByRole("link", { name: new RegExp(`^${source}`) });
    expect(
      sourceLink && {
        name: sourceLink.textContent,
        href: sourceLink.getAttribute("href"),
        target: sourceLink.getAttribute("target"),
      },
    ).toEqual(entry.sourceUrl && { name: `${source} ${NEW_TAB[language]}`, href: entry.sourceUrl, target: "_blank" });
    const tools = shown.queryByRole("list", { name: TOOLS_LABELS[language] });
    expect(
      tools &&
        within(tools)
          .getAllByRole("listitem")
          .map((tool) => tool.textContent),
    ).toEqual(entry.tools.length > 0 ? entry.tools : null);
  });
}

test.each([
  ["en", "Projects", ["Products", "Study Projects"]],
  ["ru", "Проекты", ["Продукты", "Учебные проекты"]],
] as const)(
  "the Projects Page in %s groups Entries by Project Kind, each with its links, summary and Tool chips",
  async (language, heading, names) => {
    renderPath(`/${language}/projects`);
    await screen.findByRole("heading", { level: 1, name: heading });
    const groups = within(screen.getByRole("main")).getAllByRole("heading", { level: 2 });
    expect(groups.map((group) => group.textContent)).toEqual(names);

    const shown = getProjects(language);
    groups.forEach((group, position) => {
      expectProjectEntries(group.closest("section") as HTMLElement, language, shown[position]?.entries ?? []);
    });
  },
);

test.each([
  ["en", "Projects", "All projects"],
  ["ru", "Проекты", "Все проекты"],
] as const)(
  "the Projects Section in %s shows each Featured Product as on the Projects Page, under no Project Kind heading",
  async (language, heading, more) => {
    const { scope } = await findTopic("Section", "projects", language, heading);
    const featured = getProjects(language).flatMap(({ kind, entries }) =>
      entries.filter((entry) => entry.featured).map((entry) => ({ kind, entry })),
    );
    expect(featured.map(({ kind }) => kind)).toEqual(["product"]);
    expect(
      within(scope)
        .getAllByRole("heading")
        .map((title) => title.tagName),
    ).toEqual(["H2", "H3"]);
    expectProjectEntries(
      scope,
      language,
      featured.map(({ entry }) => entry),
    );
    expect(within(scope).getByRole("link", { name: more }).getAttribute("href")).toBe(`/${language}/projects`);
  },
);

const TIMELINE_PERIODS: Record<"en" | "ru", Record<string, string>> = {
  en: {
    "economics-degree": "Sep 2003 – May 2008",
    "fcc-relational-databases": "Oct 2026 – present",
    "fcc-back-end-apis": "Sep 2026 – Oct 2026",
    "fcc-quality-assurance": "Sep 2024 – Nov 2024",
    "fcc-responsive-web-design": "Jul 2018 – Sep 2018",
    "fcc-js-algorithms": "May 2018 – Jun 2018",
    "fcc-front-end": "Oct 2017 – Dec 2017",
  },
  ru: {
    "economics-degree": "сент. 2003 – май 2008",
    "fcc-relational-databases": "окт. 2026 – по настоящее время",
    "fcc-back-end-apis": "сент. 2026 – окт. 2026",
    "fcc-quality-assurance": "сент. 2024 – нояб. 2024",
    "fcc-responsive-web-design": "июль 2018 – сент. 2018",
    "fcc-js-algorithms": "май 2018 – июнь 2018",
    "fcc-front-end": "окт. 2017 – дек. 2017",
  },
};

const LEARNING_CASES = [
  ["Section", "en", "Learning", ["certification"], ["Certifications"]],
  ["Section", "ru", "Обучение", ["certification"], ["Сертификаты"]],
  ["Page", "en", "Learning", ["education", "certification", "book"], ["Education", "Certifications", "Books"]],
  ["Page", "ru", "Обучение", ["education", "certification", "book"], ["Образование", "Сертификаты", "Книги"]],
] as const;

test.each(LEARNING_CASES)(
  "the Learning %s in %s groups its Entries by Learning Kind, Certifications and, on the Page, Education on the Timeline with their Periods",
  async (on, language, heading, kinds, names) => {
    const { scope, level, featuredOnly } = await findTopic(on, "learning", language, heading);
    const groups = within(scope).getAllByRole("heading", { level });
    expect(groups.map((group) => group.textContent)).toEqual(names);
    const levels = Array.from(scope.querySelectorAll("h1, h2, h3, h4, h5, h6"), (h) => Number(h.tagName[1]));
    expect(new Set(levels)).toEqual(new Set([level - 1, level, level + 1]));

    groups.forEach((group, position) => {
      const kind = kinds[position];
      const entries = (getLearning(language).find((shown) => shown.kind === kind)?.entries ?? []).filter(
        (entry) => !featuredOnly || entry.featured,
      );
      const onTimeline = kind === "certification" || (on === "Page" && kind === "education");
      const list = within(group.closest("section") as HTMLElement).getByRole("list");
      expect(list.tagName).toBe(onTimeline ? "OL" : "UL");
      const items = within(list).getAllByRole("listitem");
      expect(items.map((item) => within(item).getByRole("heading", { level: level + 1 }).textContent)).toEqual(
        entries.map((entry) => entry.title),
      );
      entries.forEach(({ provider }, index) => {
        expect(within(items[index] as HTMLElement).getByText(provider)).toBeDefined();
      });
      if (onTimeline) {
        entries.forEach(({ id }, index) => {
          const period = TIMELINE_PERIODS[language][id];
          expect(period).toBeDefined();
          expect(within(items[index] as HTMLElement).getByText(period as string)).toBeDefined();
        });
      }
    });
  },
);

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
