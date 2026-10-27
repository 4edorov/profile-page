import { useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";
import type { Language } from "@/shared/i18n";
import { PAGE_IDS, pagePath } from "@/shared/routing";
import { CloseIcon, MenuIcon } from "./icons";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * The Header, plus the full-screen menu that replaces its links on narrow
 * screens. The menu is a native popover, so it opens before hydration and
 * closes on Escape by itself; once hydrated, it also closes on any navigation
 * and keeps keyboard focus inside itself.
 */
export function Header({ language }: { language: Language }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const menuId = useId();
  const menu = useRef<HTMLDivElement>(null);
  const shownPath = useRef(pathname);

  // Links, the Language switch and the browser's Back button all change the path.
  useEffect(() => {
    if (shownPath.current !== pathname) {
      shownPath.current = pathname;
      closeMenu(menu.current);
    }
  }, [pathname]);

  // Always listening, and reading the menu's state from the DOM, so a menu
  // opened before hydration is covered too.
  useEffect(() => {
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !menu.current?.matches(":popover-open")) {
        return;
      }
      const focusable = menu.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const leaving = event.shiftKey ? active === first : active === last;
      if (first && last && (leaving || !menu.current.contains(active))) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    // Widening past `lg` hides the menu without closing it, which would leave
    // focus trapped in something invisible; close it for real instead.
    const closeIfHidden = () => {
      if (menu.current && getComputedStyle(menu.current).display === "none") {
        closeMenu(menu.current);
      }
    };
    document.addEventListener("keydown", trapFocus);
    window.addEventListener("resize", closeIfHidden);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      window.removeEventListener("resize", closeIfHidden);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-text/10 bg-background px-6 md:px-12">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          <nav aria-label={t("nav.pages")} className="col-start-2 hidden lg:block">
            <ul className="flex gap-8">
              <PageLinks language={language} />
            </ul>
          </nav>
          <div className="col-start-3 flex items-center justify-self-end">
            <LanguageSwitcher current={language} />
            <ThemeSwitcher />
            <button
              type="button"
              popoverTarget={menuId}
              aria-label={t("nav.openMenu")}
              title={t("nav.openMenu")}
              className="flex size-10 items-center justify-center rounded-md hover:text-primary lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <div
        ref={menu}
        id={menuId}
        popover="auto"
        className="inset-0 m-0 size-full max-h-none max-w-none border-0 bg-background p-0 text-text lg:hidden"
      >
        <div className="flex h-16 items-center justify-end border-b border-text/10 px-6 md:px-12">
          <LanguageSwitcher current={language} />
          <ThemeSwitcher />
          <button
            type="button"
            popoverTarget={menuId}
            popoverTargetAction="hide"
            aria-label={t("nav.closeMenu")}
            title={t("nav.closeMenu")}
            className="flex size-10 items-center justify-center rounded-md hover:text-primary"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label={t("nav.pages")} className="px-6 py-8 md:px-12">
          <ul className="space-y-6 text-2xl font-semibold">
            <PageLinks language={language} />
          </ul>
        </nav>
      </div>
    </>
  );
}

function closeMenu(menu: HTMLElement | null) {
  if (menu?.matches(":popover-open")) {
    menu.hidePopover();
  }
}

/** A link to every Page in Header order, marking the current one. */
function PageLinks({ language }: { language: Language }) {
  const { t } = useTranslation();
  return PAGE_IDS.map((id) => (
    <li key={id}>
      <NavLink to={pagePath(language, id)} end className="hover:text-primary aria-[current=page]:text-primary">
        {t(`pages.${id}`)}
      </NavLink>
    </li>
  ));
}
