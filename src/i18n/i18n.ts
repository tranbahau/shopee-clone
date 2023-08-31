/* eslint-disable prettier/prettier */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const locales = {
  en: 'English',
  vi: 'Vietnamese'
};

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          'Sign in': 'Sign in',
          'Sign up': 'Sign up',
          Password: 'Password',
          'New to shopee': 'New to Shopee?'
        }
      },
      vi: {
        translation: {
          // eslint-disable-next-line prettier/prettier
          'Sign in': 'Đăng nhập',
          'Sign up': 'Đăng ký',
          Password: 'Mật khẩu',
          'New to shopee': 'Bạn mới biết đến Shopee?'
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });
