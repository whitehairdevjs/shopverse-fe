export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 메뉴 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">홍길동</h3>
                  <p className="text-sm text-gray-600">hong@example.com</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                                                                               <a href="#" className="block px-4 py-2 text-gray-700 bg-orange-50 rounded-lg font-medium">주문 내역</a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">배송 조회</a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">찜 목록</a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">리뷰 관리</a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">개인정보 수정</a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">로그아웃</a>
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 주문 내역 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 주문 내역</h2>
              <div className="space-y-4">
                {[
                  { orderId: 'ORD-2024-001', date: '2024-01-15', status: '배송완료', total: '₩3,451,000' },
                  { orderId: 'ORD-2024-002', date: '2024-01-10', status: '배송중', total: '₩1,250,000' },
                  { orderId: 'ORD-2024-003', date: '2024-01-05', status: '주문완료', total: '₩899,000' }
                ].map((order, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.orderId}</h3>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === '배송완료' ? 'bg-green-100 text-green-800' :
                        order.status === '배송중' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{order.total}</span>
                                                                                                       <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 찜 목록 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">찜 목록</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'MacBook Air', price: '₩1,899,000', image: '💻' },
                  { name: 'Sony 헤드폰', price: '₩399,000', image: '🎧' },
                  { name: 'Apple Watch', price: '₩599,000', image: '⌚' }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="bg-gray-100 h-32 flex items-center justify-center text-3xl mb-3">
                      {item.image}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{item.price}</span>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 