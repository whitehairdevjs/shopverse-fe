export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price);
}

export function formatDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

export function getProductStatus(product: {
  isNew?: boolean;
  isBest?: boolean;
  isDiscount?: boolean;
}): string[] {
  const statuses: string[] = [];
  
  if (product.isNew) statuses.push('신상품');
  if (product.isBest) statuses.push('베스트');
  if (product.isDiscount) statuses.push('특가');
  
  return statuses;
} 