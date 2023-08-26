import { useContext, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { produce } from 'immer';
import { keyBy } from 'lodash';
import { toast } from 'react-toastify';
import { path } from 'src/constant/path';
import { purchaseSts } from 'src/constant/purchase';
import { formatCurrency, generateSEOPathName } from 'src/utils/util';
import purchaseApi from 'src/api/purchase.api';
import { Purchase } from 'src/types/purchase.types';
import QuantityController from 'src/components/QuantityController';
import AppContext from 'src/context/app.context';
import Button from 'src/components/Button';
import noProduct from 'src/assets/images/noProduct.png';

export default function Cart() {
  const { refetch, data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseSts.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseSts.inCart })
  });
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  const updateQuantityMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    }
  });
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch();
    }
  });
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        autoClose: 1000
      });
    }
  });
  const isAllChecked = useMemo(() => {
    return extendedPurchases.every((item) => item.checked);
  }, [extendedPurchases]);
  const checkedPurchases = useMemo(() => {
    return extendedPurchases.filter((purchase) => purchase.checked);
  }, [extendedPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasePrice = useMemo(() => {
    return checkedPurchases.reduce((result, current) => {
      return result + current.price * current.buy_count;
    }, 0);
  }, [checkedPurchases]);
  const totalCheckedPurchasePriceSaving = useMemo(() => {
    return checkedPurchases.reduce((result, current) => {
      return result + (current.price_before_discount - current.price) * current.buy_count;
    }, 0);
  }, [checkedPurchases]);

  const purchasesInCart = purchasesInCartData?.data.data;
  const location = useLocation();
  const choosenPurchaseId = (location.state as { purchaseId: string } | null)?.purchaseId;

  useEffect(() => {
    const extendedPurchaseObjectById = keyBy(extendedPurchases, '_id');
    setExtendedPurchases(
      purchasesInCart?.map((purchase) => {
        const isChoosenPurchaseId = choosenPurchaseId === purchase._id;
        return {
          ...purchase,
          checked: Boolean(isChoosenPurchaseId || extendedPurchaseObjectById[purchase._id]?.checked),
          disabled: false
        };
      }) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasesInCart]);

  useEffect(() => {
    // Use cleanup function when Cart component destroyed
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked;
      })
    );
  };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    );
  };

  const handleUpdateQuantity = (purchaseIndex: number, value: number, isEnable: boolean) => {
    if (isEnable) {
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updateQuantityMutation.mutate({ buy_count: value, product_id: extendedPurchases[purchaseIndex].product._id });
    }
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };

  const handleFocusOut = (purchaseIndex: number, value: number, isEnable: boolean) => {
    if (isEnable) {
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updateQuantityMutation.mutate({
        buy_count: value,
        product_id: extendedPurchases[purchaseIndex].product._id
      });
    }
  };

  const handleDeletePurchase = (purchaseIndex: number) => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  const handleDeleteAllPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchaseIds);
  };

  const handleBuyProducts = () => {
    if (checkedPurchasesCount > 0) {
      const body = checkedPurchases.map((item) => ({
        product_id: item.product._id,
        buy_count: item.buy_count
      }));
      buyProductsMutation.mutate(body);
    }
  };

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
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
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases?.map((purchaseItem, index) => (
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
                                    className='line-clamp-2 text-left'
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
                                disabled={purchaseItem.disabled}
                                onFocusOut={(value) =>
                                  handleFocusOut(
                                    index,
                                    value,
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                onType={handleTypeQuantity(index)}
                                classNameWrapper='flex items-center'
                                onDecrease={(value) => handleUpdateQuantity(index, value, value >= 1)}
                                onIncrease={(value) =>
                                  handleUpdateQuantity(index, value, value <= purchaseItem.product.quantity)
                                }
                              />
                            </div>
                            <div className='col-span-1'>
                              <div className='span text-orange'>
                                ₫{formatCurrency(purchaseItem.price * purchaseItem.buy_count)}
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <Button
                                onClick={() => handleDeletePurchase(index)}
                                className='cursor-pointer bg-none text-black transition-colors hover:text-orange'
                              >
                                Xoá
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex items-center rounded-sm border border-gray-100 bg-white p-5 shadow-md'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input
                  className='h-5 w-5 accent-orange'
                  type='checkbox'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
              </div>
              <button className='mx-3 border-none bg-none'>Chọn tất cả {extendedPurchases.length}</button>
              <button className='mx-3 border-none bg-none' onClick={handleDeleteAllPurchases}>
                Xoá
              </button>
              <div className='ml-auto flex items-center'>
                <div>
                  <div className='flex items-center justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm)</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-8 text-orange'>₫{formatCurrency(totalCheckedPurchasePriceSaving)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyProducts}
                  className='ml-4 flex h-10 w-52 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-red-600'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src={noProduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold text-gray-600'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 font-bold text-gray-600'>
              <Link
                to={path.home}
                className='rounded bg-orange px-10 py-3 uppercase text-white transition-all hover:bg-orange/80'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
