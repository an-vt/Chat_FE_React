import { AuthLogin, AuthRegister, UserInfo } from "../models";
import axiosClient from "./axiosClient";

const authApi = {
  login(data: AuthLogin) {
    const url = "/oauth/token";
    return axiosClient.post<AuthLogin>(url, data);
  },
  register(data: AuthRegister) {
    const url = "/oauth/register";
    return axiosClient.post<AuthRegister>(url, data);
  },
  getMe(): Promise<UserInfo | undefined> {
    const url = "/api/v1/user/me";
    return axiosClient.get(url);
  },
};

export default authApi;
