export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category: string;
  description: string;
  isNew?: boolean;
  isBest?: boolean;
  isDiscount?: boolean;
}

export interface HomePageData {
  banners: Banner[];
  categories: Category[];
  bestProducts: Product[];
  discountProducts: Product[];
  newProducts: Product[];
} 