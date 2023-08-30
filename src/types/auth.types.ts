import { User } from './user.types';
import { SuccessResponse } from './utils.type';

export type AuthResponse = SuccessResponse<{
  access_token: string;
  expires: number;
  user: User;
  refresh_token: string;
  expires_refresh_token: number;
}>;

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>;
