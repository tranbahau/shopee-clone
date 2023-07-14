import type { RegisterOptions, UseFormGetValues } from 'react-hook-form';
import * as yub from 'yup';

type Rules = { [keys in 'email' | 'password' | 'confirm_password']?: RegisterOptions };

// Option 1: RegisterOpitons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email is wrong pattern'
    },
    minLength: {
      value: 6,
      message: 'Email at least 6 characters'
    },
    maxLength: {
      value: 20,
      message: 'Email has maximum 20 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    minLength: {
      value: 6,
      message: 'Password at least 12 characters'
    },
    maxLength: {
      value: 160,
      message: 'Password has maximum 30 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    minLength: {
      value: 6,
      message: 'Password at least 12 characters'
    },
    maxLength: {
      value: 160,
      message: 'Password has maximum 30 characters'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => getValues('password') === value || 'Confirm password not matched with entered password'
        : undefined
  }
});

function testPriceMinMax(this: yub.TestContext<yub.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string };
  if (price_max !== '' && price_min !== '') {
    return Number(price_min) <= Number(price_max);
  }
  return price_max !== '' || price_min !== '';
}

// Option 2: Use schema validation (Yub)
export const schema = yub.object({
  email: yub
    .string()
    .email()
    .min(6, 'Email at least 6 characters')
    .max(32, 'Email has maximum 32 characters')
    .required(),
  password: yub
    .string()
    .min(6, 'Password at least 6 characters')
    .max(120, 'Password has maximum 32 characters')
    .required(),
  confirm_password: yub
    .string()
    .min(6, 'Password at least 6 characters')
    .max(120, 'Password has maximum 32 characters')
    .required()
    .oneOf([yub.ref('password')], 'Confirm password not matched with entered password'),
  price_min: yub.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yub.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  })
});

export type Schema = yub.InferType<typeof schema>;
