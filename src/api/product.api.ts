import { Product, ProductList, ProductListConfig } from 'src/types/product.types';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL = '/products';

const productApi = {
  async getProducts(params?: ProductListConfig) {
    return await http.get<SuccessResponse<ProductList>>(URL, {
      params
    });
  },
  async getProductDetails(id: string) {
    return await http.get<SuccessResponse<Product>>(`${URL}/${id}`);
  }
};

export default productApi;
