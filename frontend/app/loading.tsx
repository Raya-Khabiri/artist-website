export default function LoadingPage() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#f4f1eb]
        px-6
        text-[#171717]
      "
    >
      <div className="text-center">
        <div
          aria-hidden="true"
          className="
            mx-auto
            h-10
            w-10
            animate-spin
            rounded-full
            border
            border-black/15
            border-t-[#9b1c1c]
          "
        />

        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-black/50">
          Loading EAMORA
        </p>
      </div>
    </div>
  );
}