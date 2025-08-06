'use client';

import { useState } from 'react';
import TermsModal from '../../../components/common/TermsModal';
import Toast from '../../../components/common/Toast';
import ErrorModal from '../../../components/common/ErrorModal';
import { api } from '../../../utils/api';

interface SignupFormData {
  loginId: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  gender: 'M' | 'F' | 'U';
  birthDate: string;
  isSocial: boolean;
  socialProvider: string | null;
  marketingYn: boolean;
  smsYn: boolean;
  emailYn: boolean;
}

export default function SignupPage() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    error: {
      message: string;
      details?: { [key: string]: string };
    };
  }>({
    isOpen: false,
    error: {
      message: '',
    },
  });
  
  const [formData, setFormData] = useState<SignupFormData>({
    loginId: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phone: '',
    email: '',
    gender: 'U',
    birthDate: '',
    isSocial: false,
    socialProvider: null,
    marketingYn: false,
    smsYn: true,
    emailYn: true,
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    marketing: false,
  });

  const [loginIdStatus, setLoginIdStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: '',
  });

  const [emailStatus, setEmailStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // 이메일이 변경되면 중복확인 상태 초기화
      if (name === 'email') {
        setEmailStatus({
          isChecking: false,
          isAvailable: null,
          message: '',
        });
      }
    }
  };

  const handleLoginIdKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 영어, 숫자, 언더스코어만 허용
    const allowedChars = /[a-zA-Z0-9_]/;
    if (!allowedChars.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const handleLoginIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 한글 문자 제거
    const filteredValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));

    // 아이디가 변경되면 중복확인 상태 초기화 및 실시간 검증
    if (name === 'loginId') {
      if (filteredValue.length > 0 && filteredValue.length < 5) {
        setLoginIdStatus({
          isChecking: false,
          isAvailable: null,
          message: '아이디는 5자 이상으로 입력해주세요.',
        });
      } else if (filteredValue.length === 0) {
        setLoginIdStatus({
          isChecking: false,
          isAvailable: null,
          message: '',
        });
      } else {
        setLoginIdStatus({
          isChecking: false,
          isAvailable: null,
          message: '',
        });
      }
    }
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // 이용약관 체크박스가 체크되지 않은 상태에서 체크될 때 약관 팝업 표시
    if (name === 'terms' && checked && !agreements.terms) {
      setIsTermsModalOpen(true);
    }
    
    setAgreements(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'error') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const showErrorModal = (message: string, details?: { [key: string]: string }) => {
    setErrorModal({
      isOpen: true,
      error: {
        message,
        details,
      },
    });
  };

  const hideErrorModal = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }));
  };

  const checkLoginIdAvailability = async (loginId: string) => {
    if (!loginId || loginId.length < 5) {
      setLoginIdStatus({
        isChecking: false,
        isAvailable: null,
        message: '',
      });
      return;
    }

    setLoginIdStatus(prev => ({
      ...prev,
      isChecking: true,
      message: '',
    }));

    try {
      const response = await api.member.checkLoginId(loginId);
      
      console.log('중복확인 응답:', response); // 디버깅용
      
      if (response.success) {
        console.log('message 값:', response.message, '타입:', typeof response.message); // 디버깅용
        
        // message가 "true"이면 중복된 아이디
        if (response.message === "true") {
          setLoginIdStatus({
            isChecking: false,
            isAvailable: false,
            message: '이미 사용 중인 아이디입니다.',
          });
        } else if (response.message === "false") {
          setLoginIdStatus({
            isChecking: false,
            isAvailable: true,
            message: '사용 가능한 아이디입니다.',
          });
        } else {
          // message가 예상과 다른 경우 기본 처리
          console.log('예상과 다른 message 값:', response.message); // 디버깅용
          setLoginIdStatus({
            isChecking: false,
            isAvailable: false,
            message: '중복확인 결과를 확인할 수 없습니다.',
          });
        }
      } else {
        setLoginIdStatus({
          isChecking: false,
          isAvailable: false,
          message: '서버 에러가 발생 하였습니다. 잠시후 다시 시도해주세요.',
        });
      }
    } catch (error) {
      console.error('아이디 중복확인 에러:', error);
      setLoginIdStatus({
        isChecking: false,
        isAvailable: false,
        message: '중복확인 중 오류가 발생했습니다.',
      });
    }
  };

  const handleLoginIdBlur = () => {
    if (formData.loginId.trim()) {
      checkLoginIdAvailability(formData.loginId);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailStatus({
        isChecking: false,
        isAvailable: null,
        message: '',
      });
      return;
    }

    setEmailStatus(prev => ({
      ...prev,
      isChecking: true,
      message: '',
    }));

    try {
      const response = await api.member.checkEmail(email);
      
      console.log('이메일 중복확인 응답:', response); // 디버깅용
      
      if (response.success) {
        console.log('이메일 message 값:', response.message, '타입:', typeof response.message); // 디버깅용
        
        // message가 "true"이면 중복된 이메일
        if (response.message === "true") {
          setEmailStatus({
            isChecking: false,
            isAvailable: false,
            message: '이미 사용 중인 이메일입니다.',
          });
        } else if (response.message === "false") {
          setEmailStatus({
            isChecking: false,
            isAvailable: true,
            message: '사용 가능한 이메일입니다.',
          });
        } else {
          // message가 예상과 다른 경우 기본 처리
          console.log('예상과 다른 이메일 message 값:', response.message); // 디버깅용
          setEmailStatus({
            isChecking: false,
            isAvailable: false,
            message: '중복확인 결과를 확인할 수 없습니다.',
          });
        }
      } else {
        setEmailStatus({
          isChecking: false,
          isAvailable: false,
          message: '서버 에러가 발생 하였습니다. 잠시후 다시 시도해주세요.',
        });
      }
    } catch (error) {
      console.error('이메일 중복확인 에러:', error);
      setEmailStatus({
        isChecking: false,
        isAvailable: false,
        message: '중복확인 중 오류가 발생했습니다.',
      });
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim()) {
      checkEmailAvailability(formData.email);
    }
  };

  const validateForm = () => {
    if (!formData.loginId || formData.loginId.length < 5) {
      showToast('아이디는 5자 이상이어야 합니다.');
      return false;
    }
    
    // 아이디 형식 검사 (영어, 숫자, 언더스코어만 허용)
    const loginIdPattern = /^[a-zA-Z0-9_]+$/;
    if (!loginIdPattern.test(formData.loginId)) {
      showToast('아이디는 영어, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      return false;
    }

    // 아이디 중복확인 검사
    if (loginIdStatus.isAvailable === false) {
      showToast('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
      return false;
    }

    if (loginIdStatus.isAvailable === null && formData.loginId.trim()) {
      showToast('아이디 중복확인이 필요합니다.');
      return false;
    }

    // 이메일 중복확인 검사
    if (emailStatus.isAvailable === false) {
      showToast('이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.');
      return false;
    }

    if (emailStatus.isAvailable === null && formData.email.trim()) {
      showToast('이메일 중복확인이 필요합니다.');
      return false;
    }
    
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;
    if (!passwordPattern.test(formData.password)) {
      showToast('비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    if (!formData.name.trim()) {
      showToast('이름을 입력해주세요.');
      return false;
    }
    
    if (!formData.email.trim()) {
      showToast('이메일을 입력해주세요.');
      return false;
    }
    
    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      showToast('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    
    if (!agreements.terms) {
      showToast('이용약관에 동의해주세요.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.member.signup({
        loginId: formData.loginId,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname || null,
        phone: formData.phone || null,
        email: formData.email,
        gender: formData.gender,
        birthDate: formData.birthDate || null,
        isSocial: false,
        socialProvider: null,
        marketingYn: formData.marketingYn,
        smsYn: formData.smsYn,
        emailYn: formData.emailYn,
      });

      if (response.success) {
        setSuccess(true);
      } else {        
        if (response.error) {
          showErrorModal(
            response.message || response.error || '입력값 검증에 실패했습니다.',
            response.details || {}
          );         
        } else {
          showToast('회원가입에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      showToast('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              회원가입이 완료되었습니다!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ShopVerse의 회원이 되신 것을 환영합니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              로그인하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            ShopVerse 회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <a href="/login" className="font-medium text-orange-500 hover:text-orange-600">
              로그인
            </a>
          </p>
        </div>
        
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="login_id" className="block text-sm font-medium text-gray-700">
                아이디 *
              </label>
                                             <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  autoComplete="username"
                  value={formData.loginId}
                  onChange={handleLoginIdInput}
                  onKeyPress={handleLoginIdKeyPress}
                  onBlur={handleLoginIdBlur}
                  pattern="[a-zA-Z0-9_]+"
                  maxLength={20}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                    loginIdStatus.isAvailable === true 
                      ? 'border-green-300 bg-green-50' 
                      : loginIdStatus.isAvailable === false 
                      ? 'border-red-300 bg-red-50' 
                                           : formData.loginId.length > 0 && formData.loginId.length < 5
                     ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-300'
                  }`}
                                     placeholder="아이디를 입력하세요 (영어, 숫자, _만 사용, 5-20자)"
                />
               {loginIdStatus.isChecking && (
                 <div className="mt-1 flex items-center text-sm text-blue-600">
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   중복확인 중...
                 </div>
               )}
                               {loginIdStatus.message && !loginIdStatus.isChecking && (
                  <div className={`mt-1 text-sm ${
                    loginIdStatus.isAvailable === true 
                      ? 'text-green-600' 
                      : loginIdStatus.isAvailable === false 
                      ? 'text-red-600' 
                                           : formData.loginId.length > 0 && formData.loginId.length < 5
                     ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}>
                    {loginIdStatus.message}
                  </div>
                )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름 *
              </label>
                             <input
                 id="name"
                 name="name"
                 type="text"
                 autoComplete="name"
                 value={formData.name}
                 onChange={handleInputChange}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                 placeholder="이름을 입력하세요"
               />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="닉네임을 입력하세요 (선택)"
              />
            </div>

                         <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                 이메일 *
               </label>
                              <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                    emailStatus.isAvailable === true 
                      ? 'border-green-300 bg-green-50' 
                      : emailStatus.isAvailable === false 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="이메일을 입력하세요"
                />
                {emailStatus.isChecking && (
                  <div className="mt-1 flex items-center text-sm text-blue-600">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    중복확인 중...
                  </div>
                )}
                {emailStatus.message && !emailStatus.isChecking && (
                  <div className={`mt-1 text-sm ${
                    emailStatus.isAvailable === true 
                      ? 'text-green-600' 
                      : emailStatus.isAvailable === false 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                  }`}>
                    {emailStatus.message}
                  </div>
                )}
             </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 *
              </label>
                             <input
                 id="password"
                 name="password"
                 type="password"
                 autoComplete="new-password"
                 value={formData.password}
                 onChange={handleInputChange}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                 placeholder="비밀번호를 입력하세요 (8자 이상)"
               />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인 *
              </label>
                             <input
                 id="confirmPassword"
                 name="confirmPassword"
                 type="password"
                 autoComplete="new-password"
                 value={formData.confirmPassword}
                 onChange={handleInputChange}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                 placeholder="비밀번호를 다시 입력하세요"
               />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                휴대폰 번호
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="휴대폰 번호를 입력하세요 (선택)"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="U">선택안함</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
                             <input
                 id="terms"
                 name="terms"
                 type="checkbox"
                 checked={agreements.terms}
                 onChange={handleAgreementChange}
                 className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
               />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <span>이용약관 및 개인정보처리방침에 동의합니다 *</span>
                <button 
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-orange-500 hover:text-orange-600 ml-1"
                >
                  (보기)
                </button>
              </label>
            </div>

                         <div className="flex items-center">
               <input
                 id="marketingYn"
                 name="marketingYn"
                 type="checkbox"
                 checked={formData.marketingYn}
                 onChange={handleInputChange}
                 className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
               />
               <label htmlFor="marketingYn" className="ml-2 block text-sm text-gray-900">
                 마케팅 정보 수신에 동의합니다 (선택)
               </label>
             </div>

            <div className="flex items-center">
              <input
                id="smsYn"
                name="smsYn"
                type="checkbox"
                checked={formData.smsYn}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="smsYn" className="ml-2 block text-sm text-gray-900">
                SMS 수신 동의 (기본값: 동의)
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="emailYn"
                name="emailYn"
                type="checkbox"
                checked={formData.emailYn}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="emailYn" className="ml-2 block text-sm text-gray-900">
                이메일 수신 동의 (기본값: 동의)
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  가입 중...
                </div>
              ) : (
                '회원가입'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-green-500 rounded-lg shadow-sm bg-green-500 text-sm font-medium text-white hover:bg-green-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                <span className="ml-2">Naver</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-yellow-400 rounded-lg shadow-sm bg-yellow-400 text-sm font-medium text-gray-800 hover:bg-yellow-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 3C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="ml-2">Kakao</span>
              </button>
            </div>
          </div>
        </form>
      </div>
      
             {/* 이용약관 모달 */}
       <TermsModal 
         isOpen={isTermsModalOpen} 
         onClose={() => setIsTermsModalOpen(false)} 
       />
       
       {/* 토스트 알림 */}
       <Toast
         message={toast.message}
         type={toast.type}
         isVisible={toast.isVisible}
         onClose={hideToast}
         duration={4000}
       />
       
       {/* 에러 모달 */}
       <ErrorModal
         isOpen={errorModal.isOpen}
         onClose={hideErrorModal}
         error={errorModal.error}
       />
     </div>
   );
 } 