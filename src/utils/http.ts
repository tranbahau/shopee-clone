import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from 'axios';
import { HttpStatusCode } from 'src/constant/http.enum';
import { toast } from 'react-toastify';
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.types';
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  saveAccessTokenToLS,
  saveProfileToLS,
  saveRefreshTokenToLS
} from './auth';
import config from 'src/constant/config';
import { URL_LOGIN_PATH, URL_LOGOUT_PATH, URL_REFRESH_TOKEN_PATH, URL_REGISTER_PATH } from 'src/api/auth.api';
import { isAxiosTokenExpiresError, isAxiosUnauthorizedError } from './util';
import { ErrorResponse } from 'src/types/utils.type';

class Http {
  instance: AxiosInstance;
  private access_token: string;
  private refresh_token: string;
  private refreshTokenRequest: Promise<string> | null;

  constructor() {
    this.access_token = getAccessTokenFromLS();
    this.refresh_token = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10, // 30 minutes
        'expire-refresh-token': 15 // 7days
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
        if (url === URL_LOGIN_PATH || url === URL_REGISTER_PATH) {
          const access_token = data.access_token;
          const refresh_token = data.refresh_token;
          const profile = data.user;
          this.access_token = access_token;
          this.refresh_token = refresh_token;
          saveAccessTokenToLS(this.access_token);
          saveRefreshTokenToLS(this.refresh_token);
          saveProfileToLS(profile);

          return response;
        }
        if (url === URL_LOGOUT_PATH) {
          this.access_token = '';
          this.refresh_token = '';
          clearLS();
        }

        return response;
      },
      async (error: AxiosError) => {
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data.message || error.message;
          toast.error(message);
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          if (isAxiosTokenExpiresError(error) && error.config?.url !== URL_REFRESH_TOKEN_PATH) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // clear old expire access token
                  this.refreshTokenRequest = null;
                });

            return this.refreshTokenRequest.then((access_token) => {
              const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig);

              return this.instance({ ...config, headers: { ...config.headers, Authorization: access_token } });
            });
          }

          clearLS();
          this.access_token = '';
          this.refresh_token = '';
          // Show message when refresh-token expires
          toast.error(error.response?.data.data?.message || error.response?.data.message);
        }

        return Promise.reject(error);
      }
    );
  }
  private async handleRefreshToken() {
    // handle when access_token expired

    return await this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN_PATH, {
        refresh_token: this.refresh_token
      })
      .then((resp) => {
        const data = resp.data.data;
        const { access_token } = data;

        this.access_token = access_token;
        saveAccessTokenToLS(access_token);
        return access_token;
      })
      .catch((error) => {
        this.access_token = '';
        this.refresh_token = '';
        clearLS();
        throw error;
      });
  }
}

const http = new Http().instance;

export default http;
