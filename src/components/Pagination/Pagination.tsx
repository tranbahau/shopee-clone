import classNames from 'classnames';
import { Link, createSearchParams } from 'react-router-dom';
import { path } from 'src/constant/path';
import { QueryConfig } from 'src/pages/ProductList/ProductList';

interface Props {
  queryConfig: QueryConfig;
  pageSize: number;
}

const RANGE = 2;

export default function Pagination({ queryConfig, pageSize }: Props) {
  let dotAfter = false;
  let dotBefore = false;
  const currentPage = Number(queryConfig.page);
  const renderDotAfter = (index: number) => {
    if (!dotAfter) {
      dotAfter = true;
      return (
        <span key={index} className='mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'>
          ...
        </span>
      );
    }
    return null;
  };

  const renderDotBefore = (index: number) => {
    if (!dotBefore) {
      dotBefore = true;
      return (
        <span key={index} className='mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'>
          ...
        </span>
      );
    }
    return null;
  };

  const renderedPageNumber = () => {
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index);
        } else if (currentPage > RANGE * 2 + 1 && currentPage < pageSize - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index);
          }
          if (pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index);
          }
        } else if (currentPage >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index);
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber === currentPage,
              'border-transparent': pageNumber !== currentPage
            })}
          >
            <span>{pageNumber}</span>
          </Link>
        );
      });
  };

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {currentPage === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded bg-white px-3 py-2 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className={'mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'}
        >
          <span>Prev</span>
        </Link>
      )}
      {renderedPageNumber()}
      {currentPage === pageSize ? (
        <span className={'mx-2 cursor-not-allowed rounded bg-white px-3 py-2 shadow-sm'}>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className={'mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'}
        >
          <span>Next</span>
        </Link>
      )}
    </div>
  );
}
