import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type User } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const qc = useQueryClient();

  // hydrate from localStorage quickly to avoid UI flash
  const initialUser = (() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState<User | null>(initialUser);
  const [isInitialized, setIsInitialized] = useState(false);

  // keep a single source of truth in react-query for the current user
  const { data: fetchedUser, isLoading: fetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Only fetch if we have a token in localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsInitialized(true);
        return null;
      }
      const user = await userService.getCurrentUser();
      return user;
    },
    initialData: initialUser ?? undefined,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize immediately if we have cached user data to avoid loading screen
  useEffect(() => {
    if (initialUser && !isInitialized) {
      setIsInitialized(true);
    }
  }, [initialUser, isInitialized]);

  useEffect(() => {
    if (fetchedUser === null) {
      setUser(null);
      localStorage.removeItem("userData");
    } else if (fetchedUser) {
      setUser(fetchedUser);
      try {
        localStorage.setItem("userData", JSON.stringify(fetchedUser));
      } catch {}
    }
  }, [fetchedUser]);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => await userService.login(email, password),
    onSuccess: (u: User) => {
      setUser(u);
      qc.setQueryData(["user"], u);
    },
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await userService.logout();
    } finally {
      setUser(null);
      qc.removeQueries({ queryKey: ["user"] });
      try {
        localStorage.removeItem("userData");
      } catch {}
    }
  };

  const hasRole = (role: string) => !!user && user.role === role;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || fetching || loginMutation.isPending,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
