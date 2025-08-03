interface ProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({ 
  name, 
  price, 
  originalPrice, 
  discount, 
  image, 
  rating, 
  reviewCount 
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
        {image}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{name}</h3>
        
        {rating && reviewCount && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
          )}
          {discount && (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
              {discount}
            </span>
          )}
        </div>
        
                 <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
          장바구니에 추가
        </button>
      </div>
    </div>
  );
} 