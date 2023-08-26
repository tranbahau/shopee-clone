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

const handleConfirmPasswordYub = (refSchema: string) => {
  return yub
    .string()
    .min(6, 'Password at least 6 characters')
    .max(120, 'Password has maximum 32 characters')
    .required()
    .oneOf([yub.ref(refSchema)], 'Confirm password not matched with entered password');
};

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
  confirm_password: handleConfirmPasswordYub('password'),
  price_min: yub.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yub.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yub.string().trim().required()
});

export const userSchema = yub.object({
  name: yub.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  phone: yub.string().max(20, 'Độ dài tối đa là 20 kí tự'),
  address: yub.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  date_of_birth: yub.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yub.StringSchema<string | undefined, yub.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yub.StringSchema<string | undefined, yub.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYub('new_password'),
  avatar: yub.string().max(1000)
});

export type Schema = yub.InferType<typeof schema>;
export type ProfileSchema = yub.InferType<typeof userSchema>;
