// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { LEARNING_KINDS, LearningEntry } from "@/entities/profile";
import { getI18n, type Language } from "@/shared/i18n";

afterEach(cleanup);

const entry: ComponentProps<typeof LearningEntry>["entry"] = {
  id: "course",
  featured: false,
  hidden: false,
  title: "Testing",
  provider: "Academy",
  summary: "What the course covered.",
  period: { start: "2025-01", end: null },
  credential: "https://example.com/certificate",
  rating: null,
};

type LearningKind = ComponentProps<typeof LearningEntry>["kind"];

function renderEntry(overrides: Partial<typeof entry>, language: Language = "en", kind: LearningKind = "course") {
  const { container } = render(
    <I18nextProvider i18n={getI18n(language)}>
      <LearningEntry kind={kind} entry={{ ...entry, ...overrides }} />
    </I18nextProvider>,
  );
  return container;
}

test("a Learning Entry shows its title, provider, Period, summary and Credential", () => {
  renderEntry({});
  expect(screen.getByRole("heading", { name: "Testing · Academy" })).toBeDefined();
  expect(screen.getByText("Jan 2025 – present")).toBeDefined();
  expect(screen.getByText("What the course covered.")).toBeDefined();
  const credential = screen.getByRole("link", { name: /^Certificate: Testing/ });
  expect(credential.textContent).toBe("Certificate: Testing (opens in a new tab)");
  expect(screen.queryByText("Certificate")).toBeNull();
  expect(credential.getAttribute("href")).toBe("https://example.com/certificate");
  expect(credential.getAttribute("target")).toBe("_blank");
});

test("a Learning Entry without a Period, summary or Credential shows only its title and provider", () => {
  const container = renderEntry({ period: null, summary: null, credential: null });
  expect(container.textContent).toBe("Testing · Academy");
});

test.each([
  ["en", 4.3, "4.3", "Goodreads rating 4.3 out of 5"],
  ["ru", 4.3, "4,3", "Рейтинг Goodreads: 4,3 из 5"],
  ["en", 4, "4.0", "Goodreads rating 4.0 out of 5"],
] as const)(
  "in %s, a Book rated %d shows %s, linking to its Goodreads page in a new tab",
  (language, score, shown, name) => {
    const url = "https://www.goodreads.com/book/show/1";
    renderEntry({ credential: null, rating: { score, url } }, language, "book");
    expect(screen.getByText(shown)).toBeDefined();
    expect(screen.getByText("Goodreads")).toBeDefined();
    const rating = screen.getByRole("link", { name: (accessibleName) => accessibleName.startsWith(name) });
    expect(rating.textContent).toBe(`${name}Goodreads ${getI18n(language).t("opensInNewTab")}`);
    expect(rating.getAttribute("href")).toBe(url);
    expect(rating.getAttribute("target")).toBe("_blank");
  },
);

test("every Learning Kind has its own icon before the title, hidden from screen readers", () => {
  const icons = LEARNING_KINDS.map((kind) => {
    const container = renderEntry({}, "en", kind);
    const icon = container.querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.compareDocumentPosition(screen.getByText(/^Testing/)) ?? 0).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    cleanup();
    return icon?.innerHTML;
  });
  expect(new Set(icons).size).toBe(LEARNING_KINDS.length);
});
