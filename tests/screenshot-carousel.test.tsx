// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { ProjectEntries, type ProjectEntry } from "@/entities/profile";
import { getI18n, type Language } from "@/shared/i18n";

afterEach(cleanup);

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
  expect(within(carousel).getByRole("button", { name: "Предыдущий скриншот" }).hasAttribute("disabled")).toBe(true);
  expect(within(carousel).getByRole("button", { name: "Следующий скриншот" }).hasAttribute("disabled")).toBe(false);
  const dots = within(carousel).getAllByRole("button", { name: /^Скриншот \d из 3$/ });
  expect(dots.map((dot) => dot.getAttribute("aria-label"))).toEqual([
    "Скриншот 1 из 3",
    "Скриншот 2 из 3",
    "Скриншот 3 из 3",
  ]);
  expect(dots.map((dot) => dot.getAttribute("aria-current"))).toEqual(["true", null, null]);
});
