import Link from "next/link";
import { Metadata } from "next";
import BackButton from "@/components/shared/BackButton";
export const metadata: Metadata = {
  title: "404 - Trang không tồn tại",
  description: "Rất tiếc, trang bạn tìm kiếm không tồn tại.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 md:p-8">
      {/* Background Decor: Grid Pattern (Tech Vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Background Decor: Blurred Blobs (Modern UI) */}
      <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-red-100 opacity-50 blur-3xl delay-700"></div>

      {/* Main Card Container */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-blue-900/5 md:flex-row">
        {/* Left Side: Visual & Typography */}
        <div className="group relative flex w-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-blue-600 to-blue-800 p-10 text-white md:w-1/2">
          {/* Decorative Circles */}
          <div className="absolute top-10 left-10 h-20 w-20 rounded-full border-2 border-white/20 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full border-2 border-white/10 transition-transform delay-100 duration-700 group-hover:scale-110"></div>

          {/* Big 404 Text with Glitch/Offset effect concept */}
          <h1 className="text-[150px] leading-none font-black tracking-tighter opacity-90 drop-shadow-lg select-none">
            4<span className="inline-block animate-bounce text-red-400">0</span>
            4
          </h1>

          <div className="mt-4 rounded-full border border-white/30 bg-white/10 px-4 py-1 backdrop-blur-sm">
            <span className="text-sm font-medium tracking-widest uppercase">
              System Error
            </span>
          </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div className="flex w-full flex-col justify-center p-10 text-left md:w-1/2 md:p-14">
          <div className="mb-6">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Rất tiếc, trang này không tồn tại
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Có vẻ như trang bạn đang tìm kiếm đã bị gỡ bỏ hoặc đường dẫn truy
              cập đã thay đổi.
            </p>
          </div>

          {/* Divider */}
          <div className="mb-8 h-1 w-16 rounded-full bg-linear-to-r from-blue-600 to-red-500"></div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              {/* Button Hover Shine Effect */}
              <div className="absolute inset-0 h-full w-full -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Về Trang Chủ
            </Link>

            <BackButton />
          </div>

          {/* Footer Note */}
          <p className="mt-10 text-xs font-medium text-slate-400">
            Error Code: 404_NOT_FOUND_EXCEPTION
          </p>
        </div>
      </div>
    </main>
  );
}
