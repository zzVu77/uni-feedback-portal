// context/UserContext.tsx
"use client";
import { UserInfo } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type UserContextType = {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: UserInfo | null;
}) => {
  const [user, setUser] = useState<UserInfo | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
