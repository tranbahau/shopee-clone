import { User } from 'src/types/user.types';

export const getAccessTokenFromLS = (): string => {
  return localStorage.getItem('access_token') as string;
};

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token);
};

export const saveProfileToLS = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getProfileFromLS = (): User => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearLS = () => {
  localStorage.clear();
};
