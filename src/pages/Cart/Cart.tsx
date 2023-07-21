import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import purchaseApi from 'src/api/purchase.api';
import QuantityController from 'src/components/QuantityController';
import { path } from 'src/constant/path';
import { purchaseSts } from 'src/constant/purchase';
import { formatCurrency, generateSEOPathName } from 'src/utils/util';
import Button from 'src/components/Button';
import { Purchase } from 'src/types/purchase.types';
import { useEffect, useState } from 'react';
import { produce } from 'immer';

interface ExtendedPurchase extends Purchase {
  checked: boolean;
  disabled: boolean;
}

export default function Cart() {
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseSts.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseSts.inCart })
  });
  const [extendedPurchase, setExtendedPurchase] = useState<ExtendedPurchase[]>([]);
  const isAllChecked = extendedPurchase.every((item) => item.checked);

  const purchasesInCart = purchasesInCartData?.data.data;
  useEffect(() => {
    setExtendedPurchase(
      purchasesInCart?.map((purchase) => ({
        ...purchase,
        checked: false,
        disabled: false
      })) || []
    );
  }, [purchasesInCart]);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked;
      })
    );
  };

  const handleCheckAll = () => {
    setExtendedPurchase((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    );
  };

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 '>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {extendedPurchase?.map((purchaseItem, index) => (
                <div
                  className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                  key={purchaseItem._id}
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={purchaseItem.checked}
                          onChange={handleCheck(index)}
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateSEOPathName(
                              purchaseItem.product.name,
                              purchaseItem.product._id
                            )}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img src={purchaseItem.product.image} alt={purchaseItem.product.name} />
                          </Link>
                          <div className='flex-grow px-2 pb-2 pt-1'>
                            <Link
                              to={`${path.home}${generateSEOPathName(
                                purchaseItem.product.name,
                                purchaseItem.product._id
                              )}`}
                              className='text-left line-clamp-2'
                            >
                              {purchaseItem.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 items-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            ₫{formatCurrency(purchaseItem.price_before_discount)}
                          </span>
                          <span className='ml-3 '>₫{formatCurrency(purchaseItem.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={purchaseItem.product.quantity}
                          value={purchaseItem.buy_count}
                          classNameWrapper='flex items-center'
                        />
                      </div>
                      <div className='col-span-1'>
                        <div className='span text-orange'>
                          ₫{formatCurrency(purchaseItem.price * purchaseItem.buy_count)}
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <div className='cursor-pointer bg-none text-black transition-colors hover:text-orange'>Xoá</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-8 flex items-center rounded-sm border border-gray-100 bg-white p-5 shadow-md'>
          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
            <input className='h-5 w-5 accent-orange' type='checkbox' checked={isAllChecked} onChange={handleCheckAll} />
          </div>
          <button className='mx-3 border-none bg-none'>Chọn tất cả {extendedPurchase.length}</button>
          <button className='mx-3 border-none bg-none'>Xoá </button>
          <div className='ml-auto flex items-center'>
            <div>
              <div className='flex items-center justify-end'>
                <div>Tổng thanh toán (0 sản phẩm)</div>
                <div className='ml-2 text-2xl text-orange'>₫130000</div>
              </div>
              <div className='flex items-center justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-8 text-orange'>₫130000</div>
              </div>
            </div>
            <Button className='ml-4 flex h-10 w-52 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-red-600'>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
