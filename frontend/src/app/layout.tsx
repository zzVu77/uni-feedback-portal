import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";
import QueryProvider from "@/lib/QueryProvider";
import { UserInfo } from "@/types"; // Đảm bảo bạn đã export type này từ file types
import { Check, Info, X } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cổng thông tin góp ý - Trường Đại học Sư phạm Kỹ thuật TP.HCM",
  description:
    "Cổng thông tin góp ý dành cho sinh viên và giảng viên Trường Đại học Sư phạm Kỹ thuật TP.HCM",
};

const getMe = async (token: string): Promise<UserInfo | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as UserInfo;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }
};
// --- Root Layout Component ---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const userData = token ? await getMe(token) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={userData}>
          <Toaster
            position="top-right"
            icons={{
              success: <Check className="mr-4 h-5 w-5 text-green-500" />,
              info: <Info className="mr-4 h-5 w-5 text-blue-500" />,
              error: <X className="mr-4 h-5 w-5 text-red-500" />,
            }}
          />
          <QueryProvider>{children}</QueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
