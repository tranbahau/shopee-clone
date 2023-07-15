import InputNumber, { InputNumberProps } from '../InputNumber';

interface Props extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  classNameWrapper?: string;
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  value,
  classNameWrapper = 'flex items-center'
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

  return (
    <div className={classNameWrapper}>
      <div className='ml-10 flex items-center'>
        <button
          onClick={onDecreaseClick}
          className='flex h-5 w-5 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
          </svg>
        </button>
      </div>
      <InputNumber
        value={value}
        onChange={onHandleChange}
        classNameError='hidden'
        classNameInput='h-6 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
      />
      <div className='mr-10 flex items-center'>
        <button
          onClick={onIncreaseClick}
          className='flex h-5 w-5 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>
      </div>
    </div>
  );
}
