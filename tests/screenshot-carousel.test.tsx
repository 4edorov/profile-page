// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { ProjectEntries, type ProjectEntry } from "@/entities/profile";
import { getI18n, type Language } from "@/shared/i18n";

afterEach(cleanup);

// jsdom 30 lays nothing out and has no Element.scrollTo, so the track pretends each Screenshot is 100px wide.
Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 100 });
Element.prototype.scrollTo = function scrollTo(this: Element, options?: ScrollToOptions | number) {
  Object.defineProperty(this, "scrollLeft", {
    configurable: true,
    value: typeof options === "object" ? options.left : 0,
  });
  this.dispatchEvent(new Event("scroll"));
};

const entry: ProjectEntry = {
  id: "dashboard",
  featured: true,
  hidden: false,
  name: "Dashboard",
  summary: "A dashboard.",
  tools: [],
  url: null,
  sourceUrl: null,
  screenshots: [],
};

function renderEntry(screenshots: ProjectEntry["screenshots"], language: Language = "en") {
  render(
    <I18nextProvider i18n={getI18n(language)}>
      <ProjectEntries entries={[{ ...entry, screenshots }]} />
    </I18nextProvider>,
  );
}

const main = { src: "main.webp", alt: "The main page." };
const table = { src: "table.webp", alt: "The table." };
const team = { src: "team.webp", alt: "The team page." };

test("an Entry without Screenshots has no Screenshot Carousel", () => {
  renderEntry([]);
  expect(screen.queryByRole("region")).toBeNull();
  expect(screen.queryByRole("img")).toBeNull();
});

test("one Screenshot shows alone in a region named after the Entry, without buttons or dots", () => {
  renderEntry([main]);
  const carousel = screen.getByRole("region", { name: "Screenshots of Dashboard" });
  expect(within(carousel).getByRole("img", { name: "The main page." }).getAttribute("src")).toBe("main.webp");
  expect(within(carousel).queryAllByRole("button")).toEqual([]);
});

test("several Screenshots get previous and next buttons, the previous one disabled at the start, and one dot each", () => {
  renderEntry([main, table, team], "ru");
  const carousel = screen.getByRole("region", { name: "Скриншоты Dashboard" });
  expect(
    within(carousel)
      .getAllByRole("img")
      .map((image) => image.getAttribute("alt")),
  ).toEqual(["The main page.", "The table.", "The team page."]);
  expect(within(carousel).getByRole("button", { name: "Предыдущий скриншот" }).getAttribute("aria-disabled")).toBe(
    "true",
  );
  expect(within(carousel).getByRole("button", { name: "Следующий скриншот" }).getAttribute("aria-disabled")).toBe(null);
  const dots = within(carousel).getAllByRole("button", { name: /^Скриншот \d из 3$/ });
  expect(dots.map((dot) => dot.getAttribute("aria-label"))).toEqual([
    "Скриншот 1 из 3",
    "Скриншот 2 из 3",
    "Скриншот 3 из 3",
  ]);
  expect(dots.map((dot) => dot.getAttribute("aria-current"))).toEqual(["true", null, null]);
});

test("the next button keeps focus and becomes disabled on reaching the last Screenshot", () => {
  renderEntry([main, table, team]);
  const next = screen.getByRole("button", { name: "Next screenshot" });
  next.focus();
  fireEvent.click(next);
  fireEvent.click(next);
  expect(next.getAttribute("aria-disabled")).toBe("true");
  expect(next.hasAttribute("disabled")).toBe(false);
  expect(document.activeElement).toBe(next);
  fireEvent.click(next);
  expect(screen.getByRole("button", { name: "Screenshot 3 of 3" }).getAttribute("aria-current")).toBe("true");
});
