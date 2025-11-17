/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

interface AxiosInstanceCustom extends AxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
}) as AxiosInstanceCustom;

// /* ------------------ Request Interceptor ------------------ */
// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const accessToken = Cookies.get("accessToken");
//     if (accessToken) {
//       config.headers = AxiosHeaders.from(config.headers);
//       config.headers.set("Authorization", `Bearer ${accessToken}`);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// /* ------------------ Response Interceptor ------------------ */
// let isRefreshing = false;
// let failedQueue: {
//   resolve: (token?: string | null) => void;
//   reject: (err: unknown) => void;
// }[] = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    // const originalRequest: any = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         if (token) {
    //           originalRequest.headers = AxiosHeaders.from(
    //             originalRequest.headers,
    //           );
    //           originalRequest.headers.set("Authorization", `Bearer ${token}`);
    //         }
    //         return axiosInstance(originalRequest);
    //       })
    //       .catch((err) => Promise.reject(err));
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     await axios.post(
    //       `${BASE_URL}/auth/refresh`,
    //       {},
    //       { withCredentials: true },
    //     );
    //     const newAccessToken = Cookies.get("accessToken");
    //     processQueue(null, newAccessToken);

    //     if (newAccessToken) {
    //       originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
    //       originalRequest.headers.set(
    //         "Authorization",
    //         `Bearer ${newAccessToken}`,
    //       );
    //     }
    //     return axiosInstance(originalRequest);
    //   } catch (err) {
    //     processQueue(err, null);
    //     return Promise.reject(err);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }
    return Promise.reject(error);
  },
);

export default axiosInstance;
