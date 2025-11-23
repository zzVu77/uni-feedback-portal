/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server";
import { UserInfo } from "@/types";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_ACCESS_SECRET!;
export type DecodedToken = {
  sub: string;
  role: "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
  fullName: string;
  departmentId: string;
};
export async function getUserFromToken(
  token: string,
): Promise<UserInfo | null> {
  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserInfo;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
