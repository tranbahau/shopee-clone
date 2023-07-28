import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productApi from 'src/api/product.api';
import ProductRating from 'src/components/ProductRating';
import { Product, ProductListConfig } from 'src/types/product.types';
import { formatCurrency, formatToSocialStyleNumber, getIdFromPathName, rateSale } from 'src/utils/util';
import ProductItem from '../ProductItem';
import QuantityController from 'src/components/QuantityController';
import purchaseApi from 'src/api/purchase.api';
import { purchaseSts } from 'src/constant/purchase';
import { path } from 'src/constant/path';

export default function ProductDetails() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { nameId } = useParams();
  const id = getIdFromPathName(nameId as string);
  const { data: productDetails } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetails(id)
  });
  const addToCartMutation = useMutation(purchaseApi.addToCart);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState('');
  const product = productDetails?.data.data;

  const currentSlideImages = useMemo(() => {
    return product ? product.images.slice(...currentIndexImages) : [];
  }, [product, currentIndexImages]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const chooseActiveImage = (img: string) => {
    setActiveImage(img);
  };

  const nextSlide = () => {
    if (currentIndexImages[1] < (product as Product).images.length) {
      setCurrentIndexImages((prev) => [prev[0 + 1], prev[1 + 1]]);
    }
  };

  const backSlide = () => {
    if (currentIndexImages[0] < (product as Product).images.length) {
      setCurrentIndexImages((prev) => [prev[0 - 1], prev[1 - 1]]);
    }
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current as HTMLImageElement;
    // When can handle bubble event
    // Option 1
    // const { offsetX, offsetY } = event.nativeEvent;

    // Not required to handle bubble event
    // Option 2
    const offsetX = event.pageX - (rect.x + window.scrollX);
    const offsetY = event.pageY - (rect.y + window.screenY);

    const { naturalHeight, naturalWidth } = image;
    const topImage = offsetY * (1 - naturalHeight / rect.height);
    const leftImage = offsetX * (1 - naturalWidth / rect.width);
    image.style.maxWidth = 'unset';
    image.style.width = naturalWidth + 'px';
    image.style.height = naturalHeight + 'px';
    image.style.top = topImage + 'px';
    image.style.left = leftImage + 'px';
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style');
  };

  const queryConfig: ProductListConfig = {
    limit: '20',
    page: '1',
    category: product?.category._id
  };

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig);
    },
    enabled: Boolean(product),
    staleTime: 1 * 60 * 1000
  });
  const [buyCount, setBuyCount] = useState(1);

  const handleBuyCount = (value: number) => {
    setBuyCount(value);
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchaseSts.inCart }]
          });
        }
      }
    );
  };

  const buyNow = async () => {
    const resp = await addToCartMutation.mutateAsync(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchaseSts.inCart }]
          });
        }
      }
    );

    const purchaseId = resp.data.data._id;
    navigate(path.cart, { state: { purchaseId: purchaseId } });
  };

  if (!product) return null;

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full overflow-hidden pt-[100%] shadow hover:cursor-zoom-in'
                onMouseLeave={handleRemoveZoom}
                onMouseMove={handleZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                  className=' absolute left-0 top-0 h-full w-full bg-white object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={backSlide}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentSlideImages.map((img) => {
                  const isActive = img === activeImage;
                  return (
                    <div key={img} className='relative w-full pt-[100%]' onMouseEnter={() => chooseActiveImage(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  );
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={nextSlide}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <span className='mr-2 border-b border-b-orange text-orange'>{product.rating}</span>
                <ProductRating
                  rating={product.rating}
                  activeClassName='fill-orange text-orange h-4 w-4'
                  nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                />
                <div className='mx-4 h-4 w-[2px] bg-gray-300'></div>
                <div>
                  <span>{formatToSocialStyleNumber(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-7 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng </div>
                <QuantityController
                  value={buyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  onDecrease={handleBuyCount}
                  max={product.quantity}
                />
                <div className='ml-4 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={handleAddToCart}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-6 bg-white p-4 shadow'>
          <div className='container'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mb-4 mt-8 text-sm leading-loose'>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
            </div>
          </div>
        </div>

        <div className='mt-6 bg-white p-4 shadow'>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <ProductItem product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
