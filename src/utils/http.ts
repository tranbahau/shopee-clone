import axios, { AxiosError, type AxiosInstance } from 'axios';
import { HttpStatusCode } from 'src/constant/http.enum';
import { toast } from 'react-toastify';
import { AuthResponse } from 'src/types/auth.types';
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, saveProfileToLS } from './auth';
import { path } from 'src/constant/path';
import config from 'src/constant/config';

class Http {
  instance: AxiosInstance;
  private access_token: string;
  constructor() {
    this.access_token = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.Authorization = this.access_token;
          return config;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        const data = (response.data as AuthResponse).data;
        if (url === path.login || url === path.register) {
          const access_token = data.access_token;
          const profile = data.user;
          this.access_token = access_token;
          saveAccessTokenToLS(this.access_token);
          saveProfileToLS(profile);

          return response;
        }
        if (url === path.logout) {
          this.access_token = '';
          clearLS();
        }

        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data.message || error.message;

          toast.error(message);
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS();
        }

        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
