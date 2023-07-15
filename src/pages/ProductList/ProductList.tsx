import { useQuery } from '@tanstack/react-query';
import AsideFilter from './components/AsideFilter';
import ProductItem from './components/ProductItem';
import SortProductList from './components/SortProductList';
import productApi from 'src/api/product.api';
import { ProductListConfig } from 'src/types/product.types';
import Pagination from 'src/components/Pagination';
import categoriesApi from 'src/api/category.api';
import useQueryConfig from 'src/hooks/useQueryConfig';

export default function ProductList() {
  const queryConfig = useQueryConfig();
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  });

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories()
  });

  return (
    <div className='bg-gray-200 py-6'>
      {productsData && (
        <div className='container'>
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoryData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList pageSize={productsData.data.data.pagination.page_size} queryConfig={queryConfig} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>
              <Pagination pageSize={productsData.data.data.pagination.page_size} queryConfig={queryConfig} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
