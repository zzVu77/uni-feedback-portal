import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";
async function getHeaders(): Promise<Header[]> {
  return Promise.resolve([
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        {
          key: "Content-Type",
          value: "application/javascript; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
  ]);
}
const nextConfig: NextConfig = {
  /* config options here */
  headers: getHeaders,
};

export default nextConfig;
