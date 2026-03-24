/**
 * NexoBot wordmark logo.
 * The X has a distinctive open center (strokes don't connect).
 */

/* The custom X icon — can be used standalone as a brand mark */
export function NexoX({
  className = "h-[1em]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="5.5"
      strokeLinecap="butt"
      className={className}
      aria-hidden
    >
      {/* Top-left arm */}
      <line x1="1" y1="0" x2="11.5" y2="15" />
      {/* Bottom-right arm */}
      <line x1="16.5" y1="21" x2="27" y2="36" />
      {/* Top-right arm */}
      <line x1="27" y1="0" x2="16.5" y2="15" />
      {/* Bottom-left arm */}
      <line x1="11.5" y1="21" x2="1" y2="36" />
    </svg>
  );
}

/* Full wordmark: NE✕OBOT */
export function NexoLogo({
  className = "",
  height = "h-5",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-[0.14em] ${height} ${className}`}
      aria-label="NexoBot"
    >
      <span className="leading-none">NE</span>
      <NexoX className="h-[0.6em] translate-y-[0.03em] mx-[0.01em]" />
      <span className="leading-none">OBOT</span>
    </span>
  );
}
