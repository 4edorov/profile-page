import { useId, useRef } from "react";
import { IconButton } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { Heading } from "@/shared/ui/typography";

const GUTTERS = "px-4 md:px-6";

export function Dialog({
  trigger,
  title,
  closeLabel,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="text-sm text-primary underline underline-offset-4"
      >
        {trigger}
      </button>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Esc already closes it from the keyboard; this only adds closing on a backdrop click. */}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-lg bg-background text-text shadow-xl backdrop:bg-[rgb(0_0_0/0.5)] open:flex md:w-[calc(100%-4rem)]"
      >
        <div className={`flex items-start justify-between gap-4 border-b border-text/20 py-3 ${GUTTERS}`}>
          <Heading level="section" as="h2" id={titleId} className="pt-1.5">
            {title}
          </Heading>
          <IconButton label={closeLabel} onClick={() => dialog.current?.close()} className="-mr-2 shrink-0">
            <Icon>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </Icon>
          </IconButton>
        </div>
        <div className={`min-h-0 overflow-y-auto py-4 ${GUTTERS}`}>{children}</div>
      </dialog>
    </>
  );
}
