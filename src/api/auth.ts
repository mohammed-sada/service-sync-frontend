import { endpoints } from './endpoints';
import axios, { AxiosResponse } from '../utils/axios';
import User from 'src/models/User';

type loginResponseType = {};
export const login = ({
  email,
  password
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<loginResponseType>> =>
  axios.post<loginResponseType>(endpoints.login, { username: email, password, remember: true });

export const getUserProfile = (): Promise<AxiosResponse<User>> =>
  axios.get<User>(endpoints.profile);

/**
 * Logout the user.
 * Since the request does not return any data, the return type is void.
 */
export const logout = (): Promise<AxiosResponse<void>> =>
  axios.post<void>(endpoints.logout);

export type RegisterResponse = User;
export const register = ({
  username,
  email,
  fullName,
  password,
}: {
  username: string;
  email: string;
  fullName: string;
  password: string;
}): Promise<AxiosResponse<RegisterResponse>> =>
  axios.post<RegisterResponse>(endpoints.register, {
    username,
    email,
    name: fullName,
    password
  });

export const activateAccount = (token: string): Promise<AxiosResponse<void>> =>
  axios.get<void>(endpoints.activateAccount, {
    params: { token },
  })

export const updateUserProfile = (data: FormData): Promise<any> => {
  return axios.put('/auth/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};