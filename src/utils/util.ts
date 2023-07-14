import axios, { AxiosError } from 'axios';
import { HttpStatusCode } from 'src/constant/http.enum';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

export function isAxiosErrorUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function formatCurrency(input: number): string {
  return new Intl.NumberFormat('de-En', { maximumFractionDigits: 1 }).format(input);
}

export function formatToSocialStyleNumber(input: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 1, notation: 'compact' }).format(input).toLowerCase();
}

export const rateSale = (original: number, saleNumber: number) =>
  Math.round(((original - saleNumber) / original) * 100) + '%';
