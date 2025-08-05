'use client';

interface ErrorDetail {
  [key: string]: string;
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    message: string;
    details?: ErrorDetail;
  };
}

export default function ErrorModal({ isOpen, onClose, error }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 모달 내용 */}
        <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all" onClick={(e) => e.stopPropagation()}>
                     <div className="bg-white px-6 py-6">
             <div className="flex items-center justify-center mb-4">
               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                 <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                 </svg>
               </div>
             </div>
             
             <div className="text-center">
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 입력 오류
               </h3>
               <p className="text-sm text-gray-600 mb-4">
                 {error.message}
               </p>
               
               {error.details && Object.keys(error.details).length > 0 && (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                   <h4 className="text-sm font-medium text-red-800 mb-2">
                     상세 오류 내용:
                   </h4>
                   <ul className="space-y-1">
                     {Object.entries(error.details).map(([field, message]) => (
                       <li key={field} className="text-sm text-red-700">
                         <span className="font-medium">{getFieldName(field)}:</span> {message}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
           </div>
          
                     <div className="bg-gray-50 px-6 py-4 flex justify-center">
             <button
               type="button"
               onClick={onClose}
               className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
             >
               확인
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// 필드명을 한글로 변환하는 함수
function getFieldName(field: string): string {
  const fieldNames: { [key: string]: string } = {
    loginId: '아이디',
    password: '비밀번호',
    name: '이름',
    nickname: '닉네임',
    phone: '휴대폰 번호',
    email: '이메일',
    gender: '성별',
    birthDate: '생년월일',
    marketingYn: '마케팅 수신 동의',
    smsYn: 'SMS 수신 동의',
    emailYn: '이메일 수신 동의',
  };
  
  return fieldNames[field] || field;
} 