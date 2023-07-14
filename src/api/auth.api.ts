import { path } from 'src/constant/path';
import { AuthResponse } from 'src/types/auth.types';
import http from 'src/utils/http';

const authApi = {
  async registerAccount(body: { email: string; password: string }) {
    return await http.post<AuthResponse>(path.register, body);
  },

  async loginAccount(body: { email: string; password: string }) {
    await http.post<AuthResponse>(path.login, body);
  },

  async logoutAccount() {
    return await http.post(path.logout);
  }
};

export default authApi;
