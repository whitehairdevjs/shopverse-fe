'use client';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            이용약관 및 개인정보처리방침
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* 이용약관 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">제1조 (목적)</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                이 약관은 ShopVerse(이하 &ldquo;회사&rdquo;)가 제공하는 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">제2조 (정의)</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                1. &ldquo;서비스&rdquo;라 함은 회사가 제공하는 모든 서비스를 의미합니다.<br/>
                2. &ldquo;회원&rdquo;이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.<br/>
                3. &ldquo;계정&rdquo;이라 함은 이용계약을 체결한 고객이 서비스 이용을 위해 회사에 등록한 이메일 주소를 말합니다.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.<br/>
                2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.<br/>
                3. 약관이 변경되는 경우, 회사는 변경사항을 시행일자 7일 전부터 공지사항을 통해 공지합니다.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-4">제4조 (서비스의 제공)</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                1. 회사는 다음과 같은 서비스를 제공합니다.<br/>
                - 온라인 쇼핑몰 서비스<br/>
                - 상품 정보 제공 서비스<br/>
                - 주문 및 결제 서비스<br/>
                - 고객 지원 서비스<br/>
                2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
              </p>
            </div>

            {/* 개인정보처리방침 */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">개인정보처리방침</h3>
              
              <h4 className="text-md font-medium text-gray-900 mb-2">1. 개인정보의 수집 및 이용목적</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br/><br/>
                - 서비스 제공 및 계정 관리<br/>
                - 고객 상담 및 문의 응대<br/>
                - 마케팅 및 광고 활용 (동의 시)<br/>
                - 서비스 개선 및 신규 서비스 개발
              </p>

              <h4 className="text-md font-medium text-gray-900 mb-2">2. 수집하는 개인정보 항목</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                - 필수항목: 이름, 이메일, 비밀번호, 휴대폰 번호<br/>
                - 선택항목: 마케팅 정보 수신 동의 여부<br/>
                - 자동수집항목: IP주소, 쿠키, 서비스 이용기록, 접속로그
              </p>

              <h4 className="text-md font-medium text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.<br/><br/>
                - 계약 또는 청약철회 등에 관한 기록: 5년<br/>
                - 대금결제 및 재화 등의 공급에 관한 기록: 5년<br/>
                - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
              </p>

              <h4 className="text-md font-medium text-gray-900 mb-2">4. 개인정보의 파기절차 및 방법</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.<br/><br/>
                - 전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제<br/>
                - 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기
              </p>

              <h4 className="text-md font-medium text-gray-900 mb-2">5. 개인정보의 안전성 확보 조치</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.<br/><br/>
                - 개인정보의 암호화<br/>
                - 해킹 등에 대비한 기술적 대책<br/>
                - 개인정보에 대한 접근 제한<br/>
                - 개인정보 취급 직원의 최소화 및 교육
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 