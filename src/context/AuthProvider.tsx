import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import authApi from "../api/authAPI";
import { StorageKeys } from "../common/constants";
import { AuthToken, UserInfo } from "../models";
import { getFromStorage, saveToStorage } from "../utils/storage";

interface AuthContextType {
  userInfo: UserInfo;
  tokenAuthenticated: boolean;
  saveToken: (userToken: AuthToken) => void;
  saveUserInfo: (userInfo: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [tokenAuthenticated, setTokenAuthenticated] = useState<boolean>(
    !!getFromStorage(StorageKeys.ACCESS_TOKEN),
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const saveToken = (userToken: AuthToken) => {
    saveToStorage(StorageKeys.ACCESS_TOKEN, JSON.stringify(userToken));
    setTokenAuthenticated(true);
  };

  const saveUserInfo = (user: UserInfo) => {
    setUserInfo(user);
  };

  useMemo(() => {
    authApi.getMe().then((response) => {
      setUserInfo(response as UserInfo);
    });
  }, []);

  const memoedValue = useMemo(
    () => ({
      userInfo,
      tokenAuthenticated,
      saveToken,
      saveUserInfo,
    }),
    [tokenAuthenticated, userInfo, saveUserInfo, saveToken],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
