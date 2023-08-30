import { AuthResponse } from 'src/types/auth.types';
import http from 'src/utils/http';

export const URL_LOGIN_PATH = 'login';
export const URL_REGISTER_PATH = 'register';
export const URL_LOGOUT_PATH = 'logout';
export const URL_REFRESH_TOKEN_PATH = 'refresh-access-token';

const authApi = {
  async registerAccount(body: { email: string; password: string }) {
    return await http.post<AuthResponse>(URL_REGISTER_PATH, body);
  },

  async loginAccount(body: { email: string; password: string }) {
    return await http.post<AuthResponse>(URL_LOGIN_PATH, body);
  },

  async logoutAccount() {
    return await http.post(URL_LOGOUT_PATH);
  }
};

export default authApi;
