import InputNumber, { InputNumberProps } from '../InputNumber';

interface Props extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  onFocusOut?: (value: number) => void;
  classNameWrapper?: string;
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  disabled,
  onFocusOut,
  value,
  classNameWrapper = 'ml-10'
}: Props) {
  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value);

    if (max !== undefined && _value > max) {
      _value = max;
    }
    if (_value < 1) {
      _value = 1;
    }

    onType && onType(_value);
  };

  const onIncreaseClick = () => {
    let _value = Number(value) + 1;

    if (max !== undefined && _value > max) {
      _value = max;
    }

    onIncrease && onIncrease(_value);
  };

  const onDecreaseClick = () => {
    let _value = Number(value) - 1;

    if (_value < 1) {
      _value = 1;
    }

    onDecrease && onDecrease(_value);
  };

  const handleOnFocusOut = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value));
  };

  return (
    <div className={classNameWrapper + ' flex items-center'}>
      <button
        onClick={onDecreaseClick}
        disabled={disabled}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>

      <InputNumber
        value={value}
        disabled={disabled}
        onChange={onHandleChange}
        onBlur={handleOnFocusOut}
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
      />

      <button
        onClick={onIncreaseClick}
        disabled={disabled}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  );
}
