export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">상품 목록</h1>
        
        {/* 필터 및 정렬 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>카테고리</option>
              <option>전자제품</option>
              <option>패션</option>
              <option>홈&리빙</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>정렬</option>
              <option>최신순</option>
              <option>가격낮은순</option>
              <option>가격높은순</option>
            </select>
                                                               <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              필터 적용
            </button>
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'iPhone 15 Pro', price: '₩1,250,000', originalPrice: '₩1,550,000', discount: '19%', image: '📱' },
            { name: 'Galaxy S24', price: '₩1,199,000', originalPrice: '₩1,399,000', discount: '14%', image: '📱' },
            { name: 'MacBook Air', price: '₩1,899,000', originalPrice: '₩2,199,000', discount: '14%', image: '💻' },
            { name: 'Sony 헤드폰', price: '₩399,000', originalPrice: '₩499,000', discount: '20%', image: '🎧' },
            { name: 'Nike 운동화', price: '₩89,000', originalPrice: '₩159,000', discount: '44%', image: '👟' },
            { name: 'Adidas 운동화', price: '₩129,000', originalPrice: '₩229,000', discount: '44%', image: '👟' },
            { name: 'Under Armour', price: '₩79,000', originalPrice: '₩139,000', discount: '43%', image: '👟' },
            { name: 'Apple Watch', price: '₩599,000', originalPrice: '₩799,000', discount: '25%', image: '⌚' }
          ].map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
                {product.image}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                    {product.discount}
                  </span>
                </div>
                <div className="flex gap-2">
                                                                                       <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
                    장바구니
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">이전</button>
                                                               <button className="px-3 py-2 bg-orange-500 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">다음</button>
          </nav>
        </div>
      </div>
    </div>
  );
} 