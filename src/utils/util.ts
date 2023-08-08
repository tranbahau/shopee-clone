import axios, { AxiosError } from 'axios';
import config from 'src/constant/config';
import { HttpStatusCode } from 'src/constant/http.enum';
import { DEFAULT_IMGAGE } from 'src/constant/image.default';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

export function isAxiosErrorUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}
export function isAxiosErrorPayloadTooLarge<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.PayloadTooLarge;
}

export function formatCurrency(input: number): string {
  return new Intl.NumberFormat('de-En', { maximumFractionDigits: 1 }).format(input);
}

export function formatToSocialStyleNumber(input: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 1, notation: 'compact' }).format(input).toLowerCase();
}

export const rateSale = (original: number, saleNumber: number) =>
  Math.round(((original - saleNumber) / original) * 100) + '%';

/**
 * Remove special character from productName
 * @param str string
 * @returns string without special character
 */
export const removeSpecialCharacter = (str: string) =>
  // Fix ESlint
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '');

/**
 * @summary
 *  Input: This Is My Product *Name*
 *  Output: This-Is-My-Product-Name-id,{id}
 * @param name string
 * @param id string
 * @returns string
 */
export const generateSEOPathName = (name: string, id: string) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-').concat('-id,') + `${id}`;
};

/**
 * Get productId from SEO path name
 * @param name SEOPathName
 * @returns productId
 */
export const getIdFromPathName = (name: string) => {
  const string = name.split('-id,');

  return string[1];
};

export const getURLImage = (image?: string) => (image ? `${config.baseUrl}images/${image}` : DEFAULT_IMGAGE);
