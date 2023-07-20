import { InputHTMLAttributes } from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classNameError?: string;
  classNameInput?: string;
}

function InputV2(props: UseControllerProps & InputNumberProps) {
  const { field, fieldState } = useController(props);
  const { type, className, classNameError, classNameInput, onChange, ...rest } = props;
  const handleInputNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value;

    if (/^\d+$/.test(valueFromInput) || valueFromInput === '') {
      onChange && onChange(event);
    }
  };

  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} onChange={handleInputNumber} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  );
}

export default InputV2;
