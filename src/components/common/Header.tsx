export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
                           {/* 로고 */}
                 <div className="flex items-center">
                   <h1 className="text-2xl font-bold text-orange-500">ShopVerse</h1>
                 </div>
          
          {/* 검색바 */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="찾고 싶은 상품을 검색해보세요"
                                     className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
                           {/* 우측 메뉴 */}
                 <div className="flex items-center space-x-6">
                   <button className="text-gray-700 hover:text-orange-500 transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                   </button>
                   <button className="text-gray-700 hover:text-orange-500 transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                     </svg>
                   </button>
                                       <a href="/login" className="text-gray-700 hover:text-orange-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </a>
                 </div>
        </div>
        
        {/* 카테고리 네비게이션 */}
                 <nav className="flex space-x-8 py-3 border-t border-gray-100">
           <a href="/home" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">홈</a>
           <a href="/product" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">상품</a>
           <a href="/cart" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">장바구니</a>
           <a href="/order" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">주문</a>
           <a href="/mypage" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">마이페이지</a>
           <a href="/live" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">라이브</a>
           <a href="/login" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">로그인</a>
         </nav>
      </div>
    </header>
  );
} 