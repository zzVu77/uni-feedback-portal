import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cổng thông tin góp ý - Trường Đại học Sư phạm Kỹ thuật TP.HCM",
    short_name: "Cổng thông tin góp ý",
    description:
      "Cổng thông tin góp ý dành cho sinh viên và giảng viên Trường Đại học Sư phạm Kỹ thuật TP.HCM",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
