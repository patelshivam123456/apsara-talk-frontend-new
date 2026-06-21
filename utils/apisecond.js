import axios from "axios";
import {
  clearAccessToken,
  extractAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/utils/tokenStore";

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL_ASTRO || "http://localhost:5000/api"
    : "/api/astro-proxy";

const apisecond = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "*/*",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

const refreshToken = async () => {
  return axios.get(`${baseURL}/authorization/auth/refresh-token`, {
    withCredentials: true,
  });
};

apisecond.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apisecond.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error?.response?.status === 401;

    const isRefreshRequest = originalRequest?.url?.includes(
      "/authorization/auth/refresh-token",
    );

    if (!isUnauthorized || originalRequest?._retry || isRefreshRequest) {
      console.log("API Error:", error?.response?.data || error.message);

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apisecond(originalRequest))
        .catch((err) => {
          console.error("Queued Request Error:", err);
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await refreshToken();
      const nextAccessToken = extractAccessToken(refreshResponse.data);

      if (nextAccessToken) {
        setAccessToken(nextAccessToken);
      }

      processQueue();

      return apisecond(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh Token Failed:",
        refreshError?.response?.data || refreshError?.message,
      );

      processQueue(refreshError);
      clearAccessToken();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apisecond;
