# 화이트랩

화이트랩은 초보자부터 중급자까지 브라우저 개발자 도구(DevTools)와 웹 보안의 신뢰 경계를 단계적으로 배우는 한국어 실습 앱입니다. 짧은 이론, 앱 내부 모의 DevTools, 실제 F12 실습, 확인 문제, 원리·방어 해설을 한 흐름으로 제공합니다.

> 모든 실습은 이 앱이 제공하는 고정된 교육용 데이터와 본인이 소유하거나 명시적으로 허가받은 시스템에서만 진행하세요. 외부 사이트 스캔, 임의 URL 요청, 실제 자격 증명은 지원하지 않습니다.

## 기술 스택

- TypeScript, React 19, Next.js: 컴포넌트 중심 UI와 여러 경로의 정적 export를 함께 지원합니다.
- Tailwind CSS, shadcn/Base UI: 일관된 시각 토큰과 키보드 접근 가능한 기본 컨트롤을 사용합니다.
- 브라우저 `localStorage`: 계정이나 서버 없이 기기 로컬 진도를 저장하며 저장 경계는 별도 모듈로 분리했습니다.
- Node 내장 테스트 러너, TypeScript, oxlint, oxfmt: 별도의 대형 테스트 프레임워크 없이 핵심 로직을 검증합니다.

서버, 데이터베이스, 계정, 유료 외부 서비스는 사용하지 않습니다. `npm run build` 결과는 정적 파일로 내보냅니다.

## 설치와 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시된 로컬 주소(기본값 `http://localhost:3000`)를 엽니다.

공개 주소에서 공유 카드의 절대 URL이 필요할 때만 빌드 전에 `NEXT_PUBLIC_SITE_ORIGIN`을 해당 출처로 설정합니다. 설정하지 않으면 로컬 개발 주소를 사용합니다.

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

실제 브라우저 전체 흐름은 개발 서버와 디버깅 포트 9222의 Chrome/Edge를 실행한 뒤 `npm run test:browser`로 재현할 수 있습니다. `APP_URL`과 `CDP_URL` 환경 변수로 주소를 바꿀 수 있습니다.

## 실제 F12 대표 실습

1. 과정 지도에서 `DOM 변경 중단점으로 점수 추적`까지 앞 수업의 확인 문제를 완료합니다.
2. 수업의 `전용 점수 추적 실습 열기`를 누릅니다.
3. Elements(요소)에서 `#score-value`를 선택합니다.
4. 우클릭 → Break on(중단 위치) → subtree modifications(하위 트리 수정)를 선택합니다.
5. 페이지에서 `정답 제출 · 점수 +1`을 누릅니다.
6. Sources(소스)의 `score-tracer.js`에서 멈추면 Call Stack(호출 스택)과 Scope(범위)의 `nextScore`를 확인합니다.
7. 원래 수업으로 돌아와 변수명을 입력합니다.

Chrome과 Edge 버전에 따라 메뉴 이름이나 위치가 조금 다를 수 있습니다. 앱은 DevTools 열림 여부를 탐지하지 않습니다.

## 현재 구현 범위

- 기초 8개 수업: 윤리와 범위, 신뢰 경계, Elements, Console, Sources, DOM 변경 중단점, Network, Storage
- 중급 대표 실습 2개: 클라이언트 검증·객체 권한, XSS·CSRF 방어
- Elements, Console, Sources, Network, Storage 모의 DevTools
- 단계별 힌트, 답·플래그 검증, 해설과 방어 원칙
- 실제 `score-tracer.js`를 사용하는 DOM 변경 중단점 실습
- 네 패널의 단서를 조합하는 마지막 미니 CTF 1개
- 버전이 있는 로컬 진도, 손상 복구, 수업·전체 초기화
- 키보드 탐색, 명확한 포커스, 모바일·태블릿 대응, reduced motion 지원

## 알려진 제한사항

- 진도는 현재 브라우저의 현재 기기에만 저장되며 계정 동기화는 없습니다.
- 실제 F12 중단점 실습은 데스크톱 Chrome 또는 Edge에 가장 적합합니다. 모바일에서도 콘텐츠는 읽고 모의 실습을 수행할 수 있습니다.
- 모의 DevTools는 학습에 필요한 개념만 제공하며 실제 브라우저 도구 전체를 복제하지 않습니다.
- 심화 과정, 다수 CTF, 로그인, 배지, 검색, 분석, CMS와 배포 자동화는 의도적으로 포함하지 않았습니다.

구조와 새 수업 추가 방법은 [DESIGN.md](./DESIGN.md)를 참고하세요.
