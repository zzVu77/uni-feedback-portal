import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/lib/QueryProvider";
import { Check, Info, X } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/utils/server/auth.server";
import { UserInfo } from "@/types";
import { UserProvider } from "@/context/UserContext";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = token ? await getUserFromToken(token) : null;
  const userData: UserInfo | null = user
    ? {
        id: user.sub,
        fullName: user.fullName,
        role: user.role,
        departmentId: user.departmentId,
      }
    : null;
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
