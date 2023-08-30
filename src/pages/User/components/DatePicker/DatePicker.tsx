import { range } from 'lodash';
import { useEffect, useState } from 'react';

interface Props {
  value?: Date;
  onChange?: (value: Date) => void;
  errorMessage?: string;
}

export default function DatePicker({ value, onChange, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  });

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      });
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Get name select component
    const { name, value: valueFromSelect } = event.target;

    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    };

    setDate(newDate);
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='w-[20%] truncate pt-3 text-right capitalize'>Năm sinh</div>
      <div className='w-[80%] pl-5'>
        <div className='flex justify-between'>
          <select
            // defaultValue={value?.getDay() || date.date}
            value={value?.getDay() || date.date}
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option value='' disabled>
              Ngày
            </option>
            {range(1, 32).map((index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
          <select
            // defaultValue={value?.getMonth() || date.month}
            onChange={handleChange}
            value={value?.getMonth() || date.month}
            name='month'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option value='' disabled>
              Tháng
            </option>
            {range(0, 12).map((index) => (
              <option key={index} value={index}>
                {index + 1}
              </option>
            ))}
          </select>
          <select
            // defaultValue={value?.getFullYear() || date.year}
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
            name='year'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option value='' disabled>
              Năm
            </option>
            {range(1990, 2024).map((index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  );
}
