"use client";
import { UserInfo } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
