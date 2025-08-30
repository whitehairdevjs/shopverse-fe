'use client';

import { useState, useEffect } from 'react';

// Member interface
interface Member {
  name?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  marketingYn?: boolean;
  smsYn?: boolean;
  emailYn?: boolean;
}

// Profile update data interface
interface ProfileUpdateData {
  name: string;
  nickname: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  marketingYn: boolean;
  smsYn: boolean;
  emailYn: boolean;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onUpdate: (updatedData: ProfileUpdateData) => Promise<void>;
}

interface EditFormData {
  name: string;
  nickname: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  marketingYn: boolean;
  smsYn: boolean;
  emailYn: boolean;
}

export default function ProfileEditModal({ isOpen, onClose, member, onUpdate }: ProfileEditModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    nickname: '',
    phone: '',
    email: '',
    gender: '',
    birthDate: '',
    marketingYn: false,
    smsYn: false,
    emailYn: false
  });

  const [errors, setErrors] = useState<Partial<EditFormData>>({});

  // member 정보가 변경될 때마다 폼 초기화
  useEffect(() => {
    if (member) {
      setEditForm({
        name: member.name || '',
        nickname: member.nickname || '',
        phone: member.phone || '',
        email: member.email || '',
        gender: member.gender || '',
        birthDate: member.birthDate ? member.birthDate.split('T')[0] : '',
        marketingYn: member.marketingYn || false,
        smsYn: member.smsYn || false,
        emailYn: member.emailYn || false
      });
      setErrors({});
    }
  }, [member]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EditFormData> = {};

    // 이름 검증
    if (!editForm.name.trim()) {
      newErrors.name = '이름은 필수입니다.';
    }

    // 닉네임 검증
    if (!editForm.nickname.trim()) {
      newErrors.nickname = '닉네임은 필수입니다.';
    }

    // 전화번호 검증
    if (editForm.phone && !/^01[0-9][0-9]{8,9}$/.test(editForm.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 01012345678)';
    }

    // 이메일 검증
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 성별 검증
    if (editForm.gender && !/^(M|F)$/.test(editForm.gender)) {
      newErrors.gender = '성별은 M 또는 F만 입력 가능합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // 전화번호 필드인 경우 - 문자 제거
      let processedValue = value;
      if (name === 'phone') {
        processedValue = value.replace(/-/g, '');
      }
      
      setEditForm(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }

    // 에러 메시지 제거
    if (errors[name as keyof EditFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await onUpdate(editForm);
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">개인정보 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* 닉네임 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editForm.nickname}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.nickname ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="01012345678"
                maxLength={11}
              />
              <p className="text-xs text-gray-500 mt-1">하이픈(-) 없이 숫자만 입력해주세요</p>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="hong@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* 성별 */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={editForm.gender}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.gender ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">선택하세요</option>
                <option value="M">남성 (M)</option>
                <option value="F">여성 (F)</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* 생년월일 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                생년월일
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={editForm.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 수신 동의 섹션 */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">수신 동의</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingYn"
                  name="marketingYn"
                  checked={editForm.marketingYn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="marketingYn" className="ml-2 block text-sm text-gray-900">
                  마케팅 정보 수신 동의
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsYn"
                  name="smsYn"
                  checked={editForm.smsYn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="smsYn" className="ml-2 block text-sm text-gray-900">
                  SMS 수신 동의
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailYn"
                  name="emailYn"
                  checked={editForm.emailYn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="emailYn" className="ml-2 block text-sm text-gray-900">
                  이메일 수신 동의
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  수정 중...
                </div>
              ) : (
                '수정하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
