export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
                               <h4 className="text-lg font-semibold mb-4 text-orange-400">ShopVerse</h4>
            <p className="text-gray-400">
              최고의 쇼핑 경험을 제공하는 온라인 마켓플레이스입니다.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">고객지원</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">고객센터</a></li>
              <li><a href="#" className="hover:text-white transition-colors">배송안내</a></li>
              <li><a href="#" className="hover:text-white transition-colors">반품/교환</a></li>
              <li><a href="#" className="hover:text-white transition-colors">자주묻는질문</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">회사정보</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">회사소개</a></li>
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white transition-colors">채용정보</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">뉴스레터</h5>
            <p className="text-gray-400 mb-4">최신 상품 정보를 받아보세요</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="이메일 주소" 
                className="flex-1 px-3 py-2 rounded-l-lg border-0 text-gray-900"
              />
                                   <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors">
                구독
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 