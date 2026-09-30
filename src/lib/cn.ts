/**
 * Tiny class-name joiner. Avoids pulling in `clsx` for a 10-line helper.
 * Falsy values are dropped, so template expressions stay readable.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
