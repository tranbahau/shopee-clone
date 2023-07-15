import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage?: string;
  classNameError?: string;
  classNameInput?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    className,
    errorMessage,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-2 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'text-sm mt-1 min-h-[1.25rem] text-red-600',
    onChange,
    ...rest
  },
  ref
) {
  const handleInputNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event);
    }
  };

  return (
    <div className={className}>
      <input className={classNameInput} {...rest} onChange={handleInputNumber} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
});

export default InputNumber;
