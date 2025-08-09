'use client';

import ProtectedRoute from '../../../components/common/ProtectedRoute';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 상품 목록 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">상품 목록</h2>
                
                {[
                  { name: 'iPhone 15 Pro', price: '₩1,250,000', quantity: 1, image: '📱' },
                  { name: 'Galaxy S24', price: '₩1,199,000', quantity: 2, image: '📱' },
                  { name: 'MacBook Air', price: '₩1,899,000', quantity: 1, image: '💻' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
                    <div className="bg-gray-100 w-20 h-20 flex items-center justify-center text-2xl rounded-lg">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                        +
                      </button>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 요약</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">₩4,348,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span className="font-medium">₩3,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">할인</span>
                    <span className="font-medium text-red-600">-₩200,000</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">총 결제금액</span>
                      <span className="text-lg font-bold text-orange-500">₩4,151,000</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  주문하기
                </button>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>• 무료배송 조건: 5만원 이상 구매 시</p>
                  <p>• 배송 예정일: 2-3일 소요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 