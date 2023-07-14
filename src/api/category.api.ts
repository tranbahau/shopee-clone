import { path } from 'src/constant/path';
import { Category } from 'src/types/category.types';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const categoriesApi = {
  async getCategories() {
    return await http.get<SuccessResponse<Category[]>>(path.categories);
  }
};

export default categoriesApi;
