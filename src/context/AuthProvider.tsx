import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import userApi from "../api/userAPI";
import { StorageKeys } from "../common/constants";
import { AuthToken, UserInfo } from "../models";
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from "../utils/storage";

interface AuthContextType {
  userInfo: UserInfo;
  tokenAuthenticated: boolean;
  saveToken: (userToken: AuthToken) => void;
  saveUserInfo: (userInfo: UserInfo) => void;
  fetchDataUser: () => void;
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

  const fetchDataUser = useCallback(() => {
    userApi
      .getMe()
      .then((response) => {
        setUserInfo(response as UserInfo);
      })
      .catch(() => {
        setUserInfo({} as UserInfo);
        setTokenAuthenticated(false);
        removeFromStorage(StorageKeys.ACCESS_TOKEN);
        removeFromStorage(StorageKeys.REMEMBER_ME);
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    if (tokenAuthenticated) {
      fetchDataUser();
    }
  }, [tokenAuthenticated]);

  const memoedValue = useMemo(
    () => ({
      userInfo,
      tokenAuthenticated,
      saveToken,
      saveUserInfo,
      fetchDataUser,
    }),
    [tokenAuthenticated, userInfo, saveUserInfo, saveToken, fetchDataUser],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
