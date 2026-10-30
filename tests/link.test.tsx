// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, expect, test } from "vitest";
import { Link } from "@/shared/ui/link";

afterEach(cleanup);

function renderLinks() {
  const Stub = createRoutesStub([
    {
      path: "/en/",
      Component: () => (
        <>
          <Link to="/en/about/">About</Link>
          <Link to="https://github.com/4edorov">GitHub</Link>
        </>
      ),
    },
    { path: "/en/about/", Component: () => <h1>About Page</h1> },
  ]);
  render(<Stub initialEntries={["/en/"]} />);
}

test("a path to a Page navigates within the Profile Site", async () => {
  renderLinks();
  const link = await screen.findByRole("link", { name: "About" });
  expect(link.getAttribute("href")).toBe("/en/about/");
  const browserNavigates = fireEvent.click(link);
  expect(browserNavigates).toBe(false);
  expect(await screen.findByRole("heading", { name: "About Page" })).toBeDefined();
});

test("an external URL is left for the browser to open", async () => {
  renderLinks();
  const link = await screen.findByRole("link", { name: "GitHub" });
  expect(link.getAttribute("href")).toBe("https://github.com/4edorov");
  expect(fireEvent.click(link)).toBe(true);
  expect(screen.queryByRole("heading", { name: "About Page" })).toBeNull();
});
