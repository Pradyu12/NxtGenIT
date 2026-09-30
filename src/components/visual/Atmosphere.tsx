/**
 * Fixed ambient background: aurora wash, engineering grid, film grain.
 * Server-rendered (pure CSS, no state) so it costs nothing on the main thread
 * and is never missing on first paint.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__wash" />
      <div className="atmosphere__grid" />
      <div className="atmosphere__grain" />
    </div>
  );
}
