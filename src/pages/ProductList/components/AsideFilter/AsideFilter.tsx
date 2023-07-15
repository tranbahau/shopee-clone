import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import Button from 'src/components/Button';
import { path } from 'src/constant/path';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { Category } from 'src/types/category.types';
import classNames from 'classnames';
import InputNumber from 'src/components/InputNumber';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema, schema } from 'src/utils/rules';
import { NonNullUndefinedType } from 'src/types/utils.type';
import RatingStars from '../RatingStars';
import { omit } from 'lodash';
import { ObjectSchema } from 'yup';

interface Props {
  queryConfig: QueryConfig;
  categories: Category[];
}

type FormData = NonNullUndefinedType<Pick<Schema, 'price_max' | 'price_min'>>;

const priceSchema = schema.pick(['price_max', 'price_min']) as ObjectSchema<FormData>;

export default function AsideFilter({ queryConfig, categories }: Props) {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema)
  });
  const navigate = useNavigate();
  const isActiveCategory = (inputId: string) => {
    return inputId === queryConfig.category;
  };

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max.toString(),
        price_min: data.price_min.toString()
      }).toString()
    });
  });

  const onHandleRemove = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter'])).toString()
    });
  };

  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả các danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul>
        {categories.map((categoryItem) => {
          return (
            <li
              className={classNames('py-2 pl-2 ', {
                'font-semibold text-orange': isActiveCategory(categoryItem._id)
              })}
              key={categoryItem._id}
            >
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id.toString()
                  }).toString()
                }}
                className='relative px-2 '
              >
                {isActiveCategory(categoryItem._id) && (
                  <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameError='hidden'
                    classNameInput='p-1 w-full outline-none border border-gray-200 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_max');
                    }}
                  />
                );
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>

            <Controller
              name='price_max'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    classNameInput='p-1 w-full outline-none border border-gray-200 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    className='grow'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_min');
                    }}
                  />
                );
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='w-full bg-orange p-2 uppercase text-white hover:bg-orange/80'>Áp dụng</Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <Button onClick={onHandleRemove} className='mt-3 w-full bg-orange p-2 uppercase text-white hover:bg-orange/80'>
        Xoá tất cả
      </Button>
    </div>
  );
}
