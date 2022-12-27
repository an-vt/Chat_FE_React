import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AccessToken {
  access_token: string;
  remember_me: boolean;
}

interface AuthContextType {
  tokenAuthenticated: boolean;
  saveToken: (userToken: AccessToken) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [tokenAuthenticated, setTokenAuthenticated] = useState<boolean>(
    !!localStorage.getItem("access_token"),
  );

  const saveToken = (userToken: AccessToken) => {
    localStorage.setItem("access_token", JSON.stringify(userToken));
    setTokenAuthenticated(true);
  };

  const memoedValue = useMemo(
    () => ({
      tokenAuthenticated,
      saveToken,
    }),
    [tokenAuthenticated],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
