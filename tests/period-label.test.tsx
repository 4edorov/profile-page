// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import { type Period, PeriodLabel } from "@/entities/profile";
import { getI18n } from "@/shared/i18n";

afterEach(cleanup);

function renderPeriod(period: Period) {
  render(
    <I18nextProvider i18n={getI18n("en")}>
      <PeriodLabel period={period} />
    </I18nextProvider>,
  );
}

test("a Period shows its months by name", () => {
  renderPeriod({ start: "2019-03", end: "2022-08" });
  expect(screen.getByText("Mar 2019 – Aug 2022")).toBeDefined();
});

test("a month that has no name shows as written", () => {
  renderPeriod({ start: "2020-13", end: null });
  expect(screen.getByText("2020-13 – present")).toBeDefined();
});
