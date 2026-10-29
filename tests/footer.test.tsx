// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, test } from "vitest";
import type { Contact } from "@/entities/profile";
import { getI18n } from "@/shared/i18n";
import { Footer } from "@/widgets/footer";

afterEach(cleanup);

const contact: Contact = {
  openToWork: true,
  links: [{ id: "github", label: "GitHub", url: "https://github.com/4edorov" }],
  email: null,
};

function renderFooter(contact: Contact) {
  render(
    <I18nextProvider i18n={getI18n("en")}>
      <Footer contact={contact} />
    </I18nextProvider>,
  );
  return within(screen.getByRole("contentinfo"));
}

test("while the owner is not Open to Work, the Contact Section says nothing about it", () => {
  const footer = renderFooter({ ...contact, openToWork: false });
  expect(footer.getByRole("link", { name: "GitHub" })).toBeDefined();
  expect(footer.queryByText("Open to work")).toBeNull();
  // The only things hidden from screen readers are the links' icons, so no light.
  const hidden = screen.getByRole("contentinfo").querySelectorAll('[aria-hidden="true"]');
  expect([...hidden].map((element) => element.tagName)).toEqual(["svg"]);
});

test("the Open to Work light is purely visual, so screen readers read only the words", () => {
  const footer = renderFooter(contact);
  const line = footer.getByText("Open to work");
  const light = line.firstElementChild as HTMLElement;
  expect(light.getAttribute("aria-hidden")).toBe("true");
  expect(light.textContent).toBe("");
});
