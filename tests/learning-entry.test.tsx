// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { LearningEntry } from "@/entities/profile";
import { getI18n } from "@/shared/i18n";

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

function renderEntry(overrides: Partial<typeof entry>) {
  const { container } = render(
    <I18nextProvider i18n={getI18n("en")}>
      <LearningEntry entry={{ ...entry, ...overrides }} />
    </I18nextProvider>,
  );
  return container;
}

test("a Learning Entry shows its title, provider, Period, summary and Credential", () => {
  renderEntry({});
  expect(screen.getByRole("heading", { name: "Testing · Academy" })).toBeDefined();
  expect(screen.getByText("Jan 2025 – present")).toBeDefined();
  expect(screen.getByText("What the course covered.")).toBeDefined();
  const credential = screen.getByRole("link");
  expect(credential.textContent).toBe("Certificate (opens in a new tab)");
  expect(credential.getAttribute("href")).toBe("https://example.com/certificate");
  expect(credential.getAttribute("target")).toBe("_blank");
});

test("a Learning Entry without a Period, summary or Credential shows only its title and provider", () => {
  const container = renderEntry({ period: null, summary: null, credential: null });
  expect(container.textContent).toBe("Testing · Academy");
});
