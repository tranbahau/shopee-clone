import { useQuery } from '@tanstack/react-query';
import { Link, createSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { path } from 'src/constant/path';
import { purchaseSts } from 'src/constant/purchase';
import { PurchaseStatus } from 'src/types/purchase.types';
import purchaseApi from 'src/api/purchase.api';
import useQueryParams from 'src/hooks/useQueryParams';
import { formatCurrency, generateSEOPathName } from 'src/utils/util';
import { useContext } from 'react';
import AppContext from 'src/context/app.context';

const historyTabs = [
  {
    status: purchaseSts.all,
    name: 'Tất cả'
  },
  {
    status: purchaseSts.waitForConfirmation,
    name: 'Chờ xác nhận'
  },
  {
    status: purchaseSts.waitForGetting,
    name: 'Chờ lấy hàng'
  },
  {
    status: purchaseSts.inProgress,
    name: 'Đang giao'
  },
  {
    status: purchaseSts.delivered,
    name: 'Đã giao'
  },
  {
    status: purchaseSts.cancel,
    name: 'Đã huỷ'
  }
];

export default function HistoryPuchase() {
  const { isAuthenticated } = useContext(AppContext);
  const query: { status?: string } = useQueryParams();
  const status: number = Number(query.status) || purchaseSts.all;
  const { data: purchaseData } = useQuery({
    queryKey: ['products', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseStatus }),
    enabled: isAuthenticated
  });
  const purchaseList = purchaseData?.data.data;

  const historyTabLinks = historyTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.purchaseHistory,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange ': status === tab.status,
        'border-b-gray/100 text-gray-900 ': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ));

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{historyTabLinks}</div>
          <div>
            {purchaseList?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  to={`${path.home}${generateSEOPathName(purchase.product.name, purchase.product._id)}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img src={purchase.product.image} alt={purchase.product.name} className='h-20 w-20 object-cover' />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex flex-shrink-0'>
                    <div className='truncate text-gray-500 line-through'>
                      <span className='text-xs'>₫</span>
                      <span className='text-sm '>{formatCurrency(purchase.product.price_before_discount)}</span>
                    </div>
                    <div className=' ml-1 truncate text-orange'>
                      <span className='text-xs'>₫</span>
                      <span className='text-sm'>{formatCurrency(purchase.product.price)}</span>
                    </div>
                  </div>
                </Link>
                <div>
                  <div className='flex items-center justify-end'>
                    <div>Tổng giá tiền</div>
                    <div className='ml-2 text-2xl text-orange'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
