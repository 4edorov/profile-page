/** A component's fixed look, plus the layout classes (margins, display) its caller may add. */
export function withLayout(look: string, layout: string | undefined) {
  return layout ? `${look} ${layout}` : look;
}
