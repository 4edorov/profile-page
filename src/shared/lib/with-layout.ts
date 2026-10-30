export function withLayout(look: string, layout: string | undefined) {
  return layout ? `${look} ${layout}` : look;
}
