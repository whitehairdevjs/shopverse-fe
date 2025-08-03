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
}

export async function getBestProducts(): Promise<Product[]> {
  // 실제 API 호출 시에는 fetch를 사용
  return [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 1250000,
      originalPrice: 1550000,
      discount: 19,
      image: '📱',
      rating: 4.8,
      reviewCount: 1247,
      category: '전자제품',
      description: 'Apple의 최신 스마트폰'
    },
    {
      id: '2',
      name: 'Galaxy S24',
      price: 1199000,
      originalPrice: 1399000,
      discount: 14,
      image: '📱',
      rating: 4.7,
      reviewCount: 892,
      category: '전자제품',
      description: 'Samsung의 플래그십 스마트폰'
    },
    {
      id: '3',
      name: 'MacBook Air',
      price: 1899000,
      originalPrice: 2199000,
      discount: 14,
      image: '💻',
      rating: 4.9,
      reviewCount: 567,
      category: '전자제품',
      description: 'Apple의 초경량 노트북'
    },
    {
      id: '4',
      name: 'Sony 헤드폰',
      price: 399000,
      originalPrice: 499000,
      discount: 20,
      image: '🎧',
      rating: 4.8,
      reviewCount: 2341,
      category: '전자제품',
      description: '노이즈 캔슬링 헤드폰'
    }
  ];
}

export async function getDiscountProducts(): Promise<Product[]> {
  return [
    {
      id: '5',
      name: 'Nike 운동화',
      price: 89000,
      originalPrice: 159000,
      discount: 44,
      image: '👟',
      rating: 4.6,
      reviewCount: 1234,
      category: '스포츠',
      description: '편안한 러닝화'
    },
    {
      id: '6',
      name: 'Adidas 운동화',
      price: 129000,
      originalPrice: 229000,
      discount: 44,
      image: '👟',
      rating: 4.5,
      reviewCount: 987,
      category: '스포츠',
      description: '스타일리시한 운동화'
    },
    {
      id: '7',
      name: 'Under Armour',
      price: 79000,
      originalPrice: 139000,
      discount: 43,
      image: '👟',
      rating: 4.4,
      reviewCount: 654,
      category: '스포츠',
      description: '고성능 운동화'
    }
  ];
} 