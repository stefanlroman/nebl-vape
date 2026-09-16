// A single curling vapor wisp as the mark — legible at 20-28px in a nav
// bar, and the same curl motif reappears in the cursor trail and loaders.
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 20c3.5 1.5 6-1 5-4s-4-3.5-5-1c-.8 2 1 3.5 3 3s3-2.5 2-5-3.5-3.5-2.5-6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="21" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}
