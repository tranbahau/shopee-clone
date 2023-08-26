import { Link } from 'react-router-dom';
import ProductRating from 'src/components/ProductRating';
import { path } from 'src/constant/path';
import { Product as ProductType } from 'src/types/product.types';
import { formatCurrency, formatToSocialStyleNumber, generateSEOPathName } from 'src/utils/util';

interface Props {
  product: ProductType;
}

export default function ProductItem({ product }: Props) {
  return (
    <Link to={`${path.home}${generateSEOPathName(product.name, product._id)}`}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[1.75rem] text-sm'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{product.price_before_discount}</span>
            </div>
            <div className=' ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <div className='flex items-center'>
              <ProductRating rating={product.rating} />
            </div>
            <div className='ml-2 text-sm'>
              <span>{formatToSocialStyleNumber(product.sold)}</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
