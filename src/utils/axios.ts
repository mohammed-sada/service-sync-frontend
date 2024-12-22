import axios from 'axios';
import { getCookie } from 'cookies-next';
import { getItem } from 'src/hooks/useCookie';

export const StatusCodesList = {
  Success: 1001,
  ValidationError: 1002,
  InternalServerError: 1003,
  NotFound: 1004,
  UnauthorizedAccess: 1005,
  TokenExpired: 1006,
  TooManyTries: 1007,
  ServiceUnAvailable: 1008,
  ThrottleError: 1009,
  Forbidden: 1010,
  IncorrectOldPassword: 1011,
  UserInactive: 1012,
  BadRequest: 1013,
  InvalidCredentials: 1014,
  InvalidRefreshToken: 1015,
  UnsupportedFileType: 1016,
  OtpRequired: 1017,
  defaultItemDeleteError: 1018,
  RefreshTokenExpired: 1019,
};

export const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Ensures cookies are included
});

// Add a request interceptor to log cookies
axiosInstance.interceptors.request.use((config) => {
  const cookies = document.cookie; // Access cookies stored in the browser
  console.log('Cookies sent with the request:', cookies);
  return config;
});

// axiosInstance.interceptors.request.use(
//   (res) => res,
//   async (err) => {
//     const originalConfig = err.config;
//     console.log("here error here")
//     if (
//       err.response.data?.code === StatusCodesList.TokenExpired &&
//       getItem('ExpiresIn')
//     ) {
//       // eslint-disable-next-line no-underscore-dangle
//       if (!originalConfig._retry) {
//         // eslint-disable-next-line no-underscore-dangle
//         originalConfig._retry = true;
//         try {
//           await axiosInstance.post('/refresh', {}, { withCredentials: true });
//           return axiosInstance(originalConfig);
//         } catch (_error) {
//           return Promise.reject(_error);
//         }
//       }
//       return {
//         ...originalConfig,
//         cancelToken: new axios.CancelToken((cancel) =>
//           cancel('Cancel repeated request'),
//         ),
//       };
//     }
//     if (
//       err.response.data?.code === StatusCodesList.TokenExpired &&
//       !getItem('ExpiresIn')
//     ) {
//       // store.dispatch(logoutAction());
//     }

//     return Promise.reject(err);
//   },
// );

export default axiosInstance;
export type { AxiosResponse } from 'axios';