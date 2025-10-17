# ShopVerse Frontend

ShopVerse 프론트엔드 프로젝트입니다. 

이 프로젝트는 Next.js 15와 Tailwind CSS를 사용해서 만든 온라인 쇼핑몰입니다.

## 프로젝트 소개

사용자 친화적인 온라인 쇼핑 경험을 제공하는 사이트를 만드는 것이 목표입니다.

## 기술 스택

- **Next.js 15**: App Router를 사용해서 서버 사이드 렌더링 구현
- **TypeScript**: 타입 안전성 확보
- **Tailwind CSS 4**: 빠른 스타일링
- **ESLint**: 코드 품질 관리
- **Turbopack**: 빠른 개발 환경

## 시작하기

### 필요한 것들
- Node.js 18.17.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd shopverse-fe

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

그러면 `http://localhost:3000`에서 사이트를 확인할 수 있어요!

## 📁 폴더 구조

```
src/
├── app/
│   ├── (site)/           # 사이트 페이지들
│   │   ├── home/         # 홈페이지
│   │   ├── main/         # 메인페이지 (새로 추가!)
│   │   ├── product/      # 상품 페이지
│   │   ├── cart/         # 장바구니
│   │   ├── order/        # 주문 페이지
│   │   ├── mypage/       # 마이페이지
│   │   └── live/         # 라이브 쇼핑
│   ├── layout.tsx        # 전체 레이아웃
│   └── globals.css       # 전역 스타일
├── components/
│   └── common/           # 공통 컴포넌트
├── constants/            # 상수들
└── stores/              # 상태 관리
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버 실행
npm run lint     # 코드 검사
```