// đây là một cái công http request của dự án
// tất cả mọi thứ đều phải đi qua thằng này

import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosPromise,
  AxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import { StorageKeys } from "../common/constants";
import { AuthToken } from "../models";
import { getFromStorage } from "../utils/storage";

const axiosClient = axios.create({
  baseURL: "http://localhost:1337",
  withCredentials: false, // Window Authentification
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Do something before request is sent

    const localTokenString = getFromStorage(StorageKeys.ACCESS_TOKEN);
    const userToken = localTokenString
      ? (JSON.parse(localTokenString) as AuthToken)
      : null;
    if (userToken) {
      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${userToken.accessToken}`,
      );
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  (error): Promise<AxiosError | AxiosPromise<any>> => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const rememberMe = JSON.parse(
      getFromStorage(StorageKeys.REMEMBER_ME) ?? "false",
    );

    const originalConfig = error.config;
    if (!error.response) {
      toast.error(`Network error: ${error}`);
    } else {
      const status = error.response?.status;
      if (status === 401 && !originalConfig.retry) {
        if (rememberMe) {
          originalConfig.retry = true;

          // Refresh token here
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
