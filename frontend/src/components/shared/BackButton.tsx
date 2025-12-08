"use client";
export default function BackButton() {
  return (
    <button
      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-red-500/80 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:border-red-300 hover:bg-red-600/90"
      onClick={() => window.history.back()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>
      Quay Lại
    </button>
  );
}
