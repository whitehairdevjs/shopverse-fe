export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">라이브 쇼핑</h1>
        
        {/* 라이브 방송 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: 'iPhone 15 Pro 특가 라이브', 
              host: '김쇼핑', 
              viewers: 1234, 
              status: 'live',
              thumbnail: '📱',
              time: '19:00 - 21:00'
            },
            { 
              title: '패션 아이템 추천', 
              host: '이스타일', 
              viewers: 856, 
              status: 'live',
              thumbnail: '👕',
              time: '20:00 - 22:00'
            },
            { 
              title: '홈&리빙 특가', 
              host: '박인테리어', 
              viewers: 567, 
              status: 'live',
              thumbnail: '🏠',
              time: '21:00 - 23:00'
            },
            { 
              title: '스포츠용품 할인', 
              host: '최피트니스', 
              viewers: 0, 
              status: 'upcoming',
              thumbnail: '⚽',
              time: '22:00 - 24:00'
            },
            { 
              title: '뷰티 제품 리뷰', 
              host: '정뷰티', 
              viewers: 0, 
              status: 'upcoming',
              thumbnail: '💄',
              time: '23:00 - 01:00'
            },
            { 
              title: '전자제품 신상품', 
              host: '한테크', 
              viewers: 0, 
              status: 'upcoming',
              thumbnail: '💻',
              time: '24:00 - 02:00'
            }
          ].map((live, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
                  {live.thumbnail}
                </div>
                {live.status === 'live' && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      LIVE
                    </span>
                  </div>
                )}
                {live.status === 'upcoming' && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      예정
                    </span>
                  </div>
                )}
                {live.status === 'live' && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      👥 {live.viewers}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{live.title}</h3>
                <p className="text-sm text-gray-600 mb-2">호스트: {live.host}</p>
                <p className="text-sm text-gray-500 mb-3">{live.time}</p>
                                                                               <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          live.status === 'live' 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}>
                  {live.status === 'live' ? '시청하기' : '알림받기'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 라이브 채팅 (시뮬레이션) */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">인기 라이브 채팅</h2>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {[
              { user: '쇼핑러버', message: '이 제품 정말 좋아 보여요!', time: '19:05' },
              { user: '스마트구매', message: '할인율이 얼마나 되나요?', time: '19:06' },
              { user: '리뷰마스터', message: '실제로 사용해보신 분 있나요?', time: '19:07' },
              { user: '가성비왕', message: '다른 색상도 있나요?', time: '19:08' },
              { user: '쇼핑러버', message: '배송은 언제 되나요?', time: '19:09' },
              { user: '스마트구매', message: '추가 할인 혜택은 없나요?', time: '19:10' }
            ].map((chat, index) => (
              <div key={index} className="flex items-start gap-2 mb-3">
                <span className="text-sm font-medium text-blue-600">{chat.user}</span>
                <span className="text-sm text-gray-700">{chat.message}</span>
                <span className="text-xs text-gray-500 ml-auto">{chat.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="메시지를 입력하세요..." 
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
                                                               <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 