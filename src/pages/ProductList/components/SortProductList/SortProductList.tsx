import { ProductListConfig } from 'src/types/product.types';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { sortByConstant } from 'src/constant/product.constant';
import classNames from 'classnames';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { path } from 'src/constant/path';
import { omit } from 'lodash';

interface Props {
  queryConfig: QueryConfig;
  pageSize: number;
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const navigate = useNavigate();
  const { sort_by = sortByConstant.createdAt } = queryConfig;
  const currentPage = Number(queryConfig.page);
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue;
  };

  const handleSortByValue = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    });
  };

  const handleOrderPriceByValue = (orderByValue: Exclude<ProductListConfig['order'], undefined>) => [
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortByConstant.price,
        order: orderByValue
      }).toString()
    })
  ];

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex-2 flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <div>
            <button
              className={classNames('h-8  px-4 text-center text-sm capitalize ', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortByConstant.view),
                'bg-white text-black hover:bg-slate-100/80': !isActiveSortBy(sortByConstant.view)
              })}
              onClick={() => handleSortByValue(sortByConstant.view)}
            >
              Phổ biến
            </button>
          </div>
          <button
            className={classNames('h-8  px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortByConstant.createdAt),
              'bg-white text-black hover:bg-slate-100/80': !isActiveSortBy(sortByConstant.createdAt)
            })}
            onClick={() => handleSortByValue(sortByConstant.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8  px-4 text-center text-sm capitalize', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortByConstant.sold),
              'bg-white text-black hover:bg-slate-100/80': !isActiveSortBy(sortByConstant.sold)
            })}
            onClick={() => handleSortByValue(sortByConstant.sold)}
          >
            Bán chạy
          </button>

          <select
            defaultValue=''
            className={classNames('h-8  px-4 text-left text-sm capitalize outline-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortByConstant.price),
              'bg-white text-black hover:bg-slate-100/80': !isActiveSortBy(sortByConstant.price)
            })}
            onChange={(e) => handleOrderPriceByValue(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-white text-black hover:bg-slate-100/80' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black hover:bg-slate-100/80' value='asc'>
              Giá thấp đến cao
            </option>
            <option className='bg-white text-black hover:bg-slate-100/80' value='desc'>
              Giá cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{currentPage}</span>
            <span>/{pageSize}</span>
          </div>

          <div className='ml-2 flex justify-center'>
            {currentPage === 1 ? (
              <span className='flex h-8 cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60 px-3  shadow hover:bg-slate-100/80'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    page: (currentPage - 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center justify-center rounded-br-sm rounded-tr-sm bg-white px-3 text-black shadow hover:bg-slate-500/80'
              >
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-3 w-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </span>
              </Link>
            )}
            {currentPage === pageSize ? (
              <span className=' flex h-8 cursor-not-allowed  items-center justify-center rounded-bl-sm rounded-tl-sm bg-white/60 px-3  shadow hover:bg-slate-100/80'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    page: (currentPage + 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center justify-center rounded-br-sm rounded-tr-sm bg-white px-3 text-black shadow hover:bg-slate-500/80'
              >
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-3 w-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
