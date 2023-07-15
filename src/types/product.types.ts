export interface Product {
  _id: string;
  images: string[];
  price: number;
  rating: number;
  price_before_discount: number;
  quantity: number;
  sold: number;
  view: number;
  name: string;
  category: {
    _id: string;
    name: string;
    __v: number;
  };
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductList {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
}

export interface ProductListConfig {
  page?: number | string;
  limit?: number | string;
  order?: 'asc' | 'desc';
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price';
  category?: number | string;
  exclude?: number | string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
}
