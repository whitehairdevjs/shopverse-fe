'use client';

import ProtectedRoute from '../../../components/common/ProtectedRoute';

export default function OrderPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">주문하기</h1>
          
          <div className="space-y-8">
            {/* 주문 상품 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 상품</h2>
              <div className="space-y-4">
                {[
                  { name: 'iPhone 15 Pro', price: '₩1,250,000', quantity: 1, image: '📱' },
                  { name: 'Galaxy S24', price: '₩1,199,000', quantity: 2, image: '📱' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
                    <div className="bg-gray-100 w-16 h-16 flex items-center justify-center text-xl rounded-lg">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">배송 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">받는 사람</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="이름을 입력하세요" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="010-0000-0000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">배송지 주소</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="주소를 입력하세요" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세 주소</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="상세 주소를 입력하세요" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">배송 메모</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} placeholder="배송 관련 메모를 입력하세요"></textarea>
                </div>
              </div>
            </div>

            {/* 결제 방법 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">결제 방법</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="radio" name="payment" className="mr-3" defaultChecked />
                  <span>신용카드</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>계좌이체</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>무통장입금</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>휴대폰 결제</span>
                </label>
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">주문 요약</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">₩3,648,000</span>
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
                    <span className="text-lg font-bold text-orange-500">₩3,451,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 주문 버튼 */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                취소
              </button>
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                주문 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 