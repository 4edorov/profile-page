// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { LearningGroups } from "@/entities/profile";
import { getI18n } from "@/shared/i18n";

afterEach(cleanup);

test("an Education Entry without a Period still takes its place on the Learning Page's Timeline", () => {
  const entry = {
    id: "degree",
    featured: false,
    hidden: false,
    title: "Degree",
    provider: "University",
    summary: null,
    period: null,
    credential: null,
    rating: null,
  };
  render(
    <I18nextProvider i18n={getI18n("en")}>
      <LearningGroups groups={[{ kind: "education", entries: [entry] }]} topicPage />
    </I18nextProvider>,
  );
  const timeline = screen.getByRole("list");
  expect(timeline.tagName).toBe("OL");
  const item = within(timeline).getByRole("listitem");
  expect(item.textContent).toBe("DegreeUniversity");
});
