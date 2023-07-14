import { InputHTMLAttributes } from 'react';
import type { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  errorMessage?: string;
  classNameError?: string;
  classNameInput?: string;
}

export default function Input({
  autoComplete,
  errorMessage,
  register,
  rules,
  type,
  placeholder,
  name,
  className,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-2 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'text-sm mt-1 min-h-[1.25rem] text-red-600'
}: Props) {
  const registerExtends = register && name ? register(name, rules) : {};

  return (
    <div className={className}>
      <input
        type={type}
        className={classNameInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registerExtends}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}
