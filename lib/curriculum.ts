export type CourseLevel = 'foundation' | 'intermediate' | 'ctf';
export type DevToolsTab =
  | 'elements'
  | 'console'
  | 'sources'
  | 'network'
  | 'storage';

export interface Lesson {
  id: string;
  level: CourseLevel;
  order: number;
  title: string;
  eyebrow: string;
  duration: string;
  goal: string;
  theory: string[];
  devtoolsTab: DevToolsTab;
  mockTask: string;
  f12Steps: string[];
  question: string;
  placeholder: string;
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
  defense: string;
}

export const lessons: Lesson[] = [
  {
    id: 'scope-and-ethics',
    level: 'foundation',
    order: 1,
    title: '화이트해킹과 허가 범위',
    eyebrow: '기초 01',
    duration: '6분',
    goal: '화이트해킹의 목적과 합법적인 실습 범위를 구분합니다.',
    theory: [
      '화이트해킹은 명시적인 허가 아래 약점을 찾아 방어를 개선하는 활동입니다.',
      '기술적으로 가능하다는 사실은 실행 권한을 뜻하지 않습니다. 대상, 시간, 방법을 허가 문서로 확인해야 합니다.',
      '이 과정의 모든 상호작용은 앱 내부의 고정된 장난감 데이터만 다룹니다.',
    ],
    devtoolsTab: 'elements',
    mockTask:
      'Elements에서 training-scope 속성을 선택해 허용된 대상을 확인하세요.',
    f12Steps: [
      '이 페이지에서 F12 또는 Ctrl+Shift+I를 눌러 개발자 도구를 엽니다.',
      'Elements(요소) 탭에서 data-training-scope를 검색합니다.',
      '값이 this-app-only인지 확인하고 외부 사이트에는 시도하지 않습니다.',
    ],
    question: '이 과정에서 허용된 실습 대상을 입력하세요.',
    placeholder: '예: this-app-only',
    acceptedAnswers: ['this-app-only', '이 앱', '화이트랩'],
    hints: [
      '모의 Elements의 main 요소를 선택하세요.',
      'data-training-scope 속성의 값을 읽어 보세요.',
    ],
    explanation:
      '허가 범위는 도구 사용보다 먼저 확인해야 하는 보안 작업의 출발점입니다.',
    defense:
      '조직은 자산 목록, 테스트 범위, 중단 조건과 보고 채널을 문서로 남겨야 합니다.',
  },
  {
    id: 'trust-boundary',
    level: 'foundation',
    order: 2,
    title: '브라우저와 서버의 신뢰 경계',
    eyebrow: '기초 02',
    duration: '8분',
    goal: '화면에 표시된 값과 서버가 검증해야 하는 값을 구분합니다.',
    theory: [
      '브라우저는 사용자 기기에서 실행되므로 DOM, JavaScript 상태, 요청을 사용자가 관찰하고 바꿀 수 있습니다.',
      '서버는 클라이언트가 보낸 가격, 역할, 점수를 그대로 신뢰하면 안 됩니다.',
      '신뢰 경계(Trust Boundary)를 지나는 값은 서버가 권한과 무결성을 다시 확인해야 합니다.',
    ],
    devtoolsTab: 'console',
    mockTask: '허용된 명령 state.score와 state.serverScore를 비교하세요.',
    f12Steps: [
      'Elements에서 #display-score의 텍스트를 바꿔 봅니다.',
      '화면만 바뀌고 앱의 상태는 그대로인지 관찰합니다.',
      '새로고침하면 표시 변경이 사라지는지 확인합니다.',
    ],
    question: '최종 점수를 신뢰할 수 있게 검증해야 하는 곳은 어디인가요?',
    placeholder: '브라우저 또는 서버',
    acceptedAnswers: ['서버', 'server'],
    hints: [
      '사용자가 직접 제어하기 어려운 쪽을 생각하세요.',
      '정답은 서버(Server)입니다.',
    ],
    explanation:
      'DOM을 바꾸는 것은 화면 표현만 바꾸며 서버의 신뢰 가능한 상태를 바꾸지 않습니다.',
    defense:
      '가격, 점수, 역할과 권한은 서버가 원본 데이터와 인증된 사용자 정보를 기준으로 계산합니다.',
  },
  {
    id: 'elements-dom',
    level: 'foundation',
    order: 3,
    title: 'Elements와 DOM 검사·수정',
    eyebrow: '기초 03',
    duration: '8분',
    goal: '문서 객체 모델(DOM)의 구조와 일시적인 화면 수정을 이해합니다.',
    theory: [
      'DOM은 브라우저가 HTML을 객체 트리로 표현한 것입니다.',
      'Elements 탭에서는 요소, 속성, 계산된 스타일을 실시간으로 검사할 수 있습니다.',
      '로컬 DOM 수정은 원본 서버 파일이나 다른 사용자의 화면을 바꾸지 않습니다.',
    ],
    devtoolsTab: 'elements',
    mockTask: '#score 요소를 선택하고 표시 값과 data-source 속성을 확인하세요.',
    f12Steps: [
      'Elements(요소)에서 검사 도구로 점수 숫자를 선택합니다.',
      '텍스트를 999로 바꾸고 화면 변화를 관찰합니다.',
      '페이지를 새로고침해 원래 값으로 돌아오는지 확인합니다.',
    ],
    question: '브라우저가 HTML을 트리 형태로 표현한 것을 무엇이라 하나요?',
    placeholder: '영문 약어',
    acceptedAnswers: ['dom', '문서 객체 모델'],
    hints: [
      'Document Object Model의 약어입니다.',
      'D로 시작하는 세 글자입니다.',
    ],
    explanation:
      'DOM 편집은 관찰과 디버깅에 유용하지만 애플리케이션의 신뢰 가능한 데이터를 직접 바꾸지는 않습니다.',
    defense:
      '중요한 판단은 DOM의 숨김 여부나 disabled 속성에 의존하지 말고 서버에서 검증합니다.',
  },
  {
    id: 'console-state',
    level: 'foundation',
    order: 4,
    title: 'Console과 JavaScript 상태',
    eyebrow: '기초 04',
    duration: '9분',
    goal: 'Console에서 표현 값과 애플리케이션 상태를 구분해 관찰합니다.',
    theory: [
      'Console은 실행 흐름과 상태를 관찰하는 디버깅 도구입니다.',
      '낯선 코드를 Console에 붙여넣으면 계정이나 데이터가 위험해질 수 있습니다.',
      '이 모의 Console은 eval 없이 state.score, state.gold, help만 해석합니다.',
    ],
    devtoolsTab: 'console',
    mockTask:
      'help를 실행한 뒤 state.gold 명령으로 고정된 장난감 상태를 확인하세요.',
    f12Steps: [
      '실제 Console(콘솔)을 열고 직접 작성한 간단한 document.title만 확인합니다.',
      '출처를 모르는 코드는 붙여넣지 않습니다.',
      'Console과 화면 요소가 같은 페이지 상태를 바라보는지 비교합니다.',
    ],
    question: '모의 Console에서 골드를 확인하는 허용 명령을 입력하세요.',
    placeholder: 'state.____',
    acceptedAnswers: ['state.gold'],
    hints: [
      'help 명령을 먼저 실행하세요.',
      '상태를 뜻하는 state와 gold를 점으로 연결합니다.',
    ],
    explanation:
      '명령 허용 목록 방식은 학습에 필요한 관찰만 제공하고 임의 코드 실행을 막습니다.',
    defense:
      '제품에서 민감한 값은 클라이언트 번들, DOM, Console에 노출하지 않습니다.',
  },
  {
    id: 'sources-debugging',
    level: 'foundation',
    order: 5,
    title: 'Sources, 중단점과 호출 스택',
    eyebrow: '기초 05',
    duration: '11분',
    goal: '중단점(Breakpoint), 호출 스택(Call Stack), 범위(Scope)를 읽습니다.',
    theory: [
      '중단점은 특정 코드 줄에서 실행을 잠시 멈춥니다.',
      '호출 스택은 현재 함수에 도달한 함수 호출 순서를 보여 줍니다.',
      'Scope는 멈춘 위치에서 접근 가능한 지역 변수와 상위 범위 값을 보여 줍니다.',
    ],
    devtoolsTab: 'sources',
    mockTask:
      '7번 줄에 중단점을 켜고 실행해 nextScore와 호출 스택을 확인하세요.',
    f12Steps: [
      'Sources(소스) 탭에서 public/score-tracer.js를 찾습니다.',
      'updateScoreDom 함수 줄에 중단점을 설정합니다.',
      '대표 실습 페이지에서 점수 올리기를 눌러 멈춤 상태를 관찰합니다.',
    ],
    question: '현재 함수까지 도달한 호출 순서를 보여 주는 영역은?',
    placeholder: '한국어 또는 영어',
    acceptedAnswers: ['call stack', '호출 스택', 'callstack'],
    hints: ['함수 호출을 쌓아 보여 줍니다.', '영문 메뉴명은 Call Stack입니다.'],
    explanation:
      '실행을 멈추면 결과뿐 아니라 값이 만들어진 경로와 당시 변수를 함께 추적할 수 있습니다.',
    defense:
      '민감한 로직을 숨기는 것에 의존하지 말고 서버 검증과 최소 권한을 적용합니다.',
  },
  {
    id: 'dom-breakpoint-score',
    level: 'foundation',
    order: 6,
    title: 'DOM 변경 중단점으로 점수 추적',
    eyebrow: '기초 06 · 대표 실습',
    duration: '14분',
    goal: '실제 F12에서 DOM 변경을 일으킨 JavaScript 위치와 변수를 찾습니다.',
    theory: [
      'DOM 변경 중단점은 선택한 요소나 하위 트리가 바뀌는 순간 실행을 멈춥니다.',
      '점수 숫자를 직접 편집하는 것과 점수 상태를 계산해 DOM에 반영하는 것은 다른 동작입니다.',
      '이 실습 스크립트는 읽기 쉬운 고정 함수명만 사용하며 비밀값은 포함하지 않습니다.',
    ],
    devtoolsTab: 'sources',
    mockTask: '중단점을 켜고 실행한 뒤 Scope의 nextScore 값을 확인하세요.',
    f12Steps: [
      '아래 전용 실습을 열고 #score-value를 Elements(요소)에서 선택합니다.',
      '우클릭 → Break on(중단 위치) → subtree modifications(하위 트리 수정)를 선택합니다.',
      '점수 올리기를 누른 뒤 Sources의 Scope(범위)에서 변수명을 확인합니다. Chrome과 Edge 버전에 따라 표현은 조금 다를 수 있습니다.',
    ],
    question: 'DOM이 바뀌는 줄에서 Scope에 보이는 지역 변수명을 입력하세요.',
    placeholder: '예: nextScore',
    acceptedAnswers: ['nextscore'],
    hints: [
      '실습 페이지의 점수 span에 DOM 변경 중단점을 거세요.',
      'updateScoreDom(nextScore) 함수의 매개변수 이름입니다.',
      '정답은 nextScore입니다.',
    ],
    explanation:
      '화면 숫자 편집은 표시만 바꾸지만, applyScoreIncrement는 상태를 계산한 뒤 updateScoreDom을 호출합니다.',
    defense:
      '클라이언트 점수는 조작 가능하다고 가정하고 서버가 이벤트, 규칙, 권한을 다시 검증해야 합니다.',
  },
  {
    id: 'network-http',
    level: 'foundation',
    order: 7,
    title: 'Network와 HTTP 요청·응답',
    eyebrow: '기초 07',
    duration: '10분',
    goal: '요청 메서드, 상태 코드, 응답 본문을 안전한 모의 요청에서 읽습니다.',
    theory: [
      'Network 탭은 페이지가 주고받은 HTTP 요청과 응답을 보여 줍니다.',
      '상태 코드 200은 요청 처리 성공을 뜻하지만 데이터가 안전하다는 보장은 아닙니다.',
      '이 실습은 외부 URL 없이 앱 내부의 고정 응답만 사용합니다.',
    ],
    devtoolsTab: 'network',
    mockTask:
      '모의 요청을 보내고 /training/profile 응답의 status와 role을 확인하세요.',
    f12Steps: [
      'Network(네트워크) 탭을 열고 페이지를 새로고침합니다.',
      '문서와 정적 스크립트 요청의 Method와 Status를 비교합니다.',
      '요청 헤더에 실제 비밀값이 없는지 확인합니다.',
    ],
    question: '모의 프로필 요청의 HTTP 상태 코드는?',
    placeholder: '숫자 세 자리',
    acceptedAnswers: ['200'],
    hints: [
      'Network에서 요청 보내기를 누르세요.',
      '선택한 행의 Status 열을 확인하세요.',
    ],
    explanation:
      '요청 세부 정보를 읽으면 UI 뒤에서 어떤 데이터 흐름이 일어나는지 추적할 수 있습니다.',
    defense:
      '응답에는 사용자에게 필요한 최소 데이터만 포함하고 모든 요청에서 인증과 권한을 검증합니다.',
  },
  {
    id: 'browser-storage',
    level: 'foundation',
    order: 8,
    title: 'Cookie와 브라우저 저장소',
    eyebrow: '기초 08',
    duration: '10분',
    goal: 'Cookie, Local Storage, Session Storage의 수명과 전송 차이를 설명합니다.',
    theory: [
      'Cookie는 설정에 따라 같은 출처의 HTTP 요청에 자동으로 포함될 수 있습니다.',
      'Local Storage는 브라우저에 남고 JavaScript에서 접근 가능하므로 비밀 저장소가 아닙니다.',
      'Session Storage는 탭 단위로 유지되지만 역시 민감한 인증 정보를 안전하게 보관해 주지는 않습니다.',
    ],
    devtoolsTab: 'storage',
    mockTask: '세 저장소를 전환해 수명과 자동 전송 여부를 비교하세요.',
    f12Steps: [
      'Application 또는 Storage(저장소) 탭을 엽니다.',
      'Local Storage에서 white-lab-progress-v1 키를 확인합니다.',
      '값이 버전과 완료 수업 ID만 담고 실제 개인정보는 없는지 확인합니다.',
    ],
    question: '탭을 닫을 때 일반적으로 사라지는 저장소는?',
    placeholder: '영문 또는 한국어',
    acceptedAnswers: [
      'session storage',
      'sessionstorage',
      '세션 스토리지',
      '세션 저장소',
    ],
    hints: [
      '이름에 세션(Session)이 포함됩니다.',
      'Application 탭의 Session Storage입니다.',
    ],
    explanation:
      '저장 위치마다 수명과 전송 방식은 다르지만 클라이언트 저장소는 사용자가 볼 수 있습니다.',
    defense:
      '세션 쿠키에는 Secure, HttpOnly, SameSite를 검토하고 브라우저 저장소에는 비밀을 넣지 않습니다.',
  },
  {
    id: 'validation-access',
    level: 'intermediate',
    order: 9,
    title: '클라이언트 검증과 접근 권한',
    eyebrow: '중급 대표 실습 01',
    duration: '13분',
    goal: '클라이언트 검증 우회와 인증(Authentication)·권한 부여(Authorization)를 구분합니다.',
    theory: [
      '클라이언트 검증은 빠른 피드백을 주지만 요청 자체를 바꿀 수 있어 보안 경계가 아닙니다.',
      '인증은 사용자가 누구인지, 권한 부여는 그 사용자가 특정 객체에 접근 가능한지 판단합니다.',
      '객체 ID만 바꿔 다른 자료를 읽을 수 있다면 서버의 객체 단위 권한 검사가 빠진 것입니다.',
    ],
    devtoolsTab: 'network',
    mockTask:
      '모의 요청의 userId와 ownerId를 비교해 서버가 확인해야 할 필드를 찾으세요.',
    f12Steps: [
      '모의 Network 요청만 사용하고 외부 요청은 만들지 않습니다.',
      '고정된 trainee-07 사용자와 report-3 소유자를 비교합니다.',
      'UI의 disabled 상태와 서버 권한 검사가 왜 다른지 설명해 봅니다.',
    ],
    question: '특정 보고서를 읽을 수 있는지 판단하는 보안 개념은?',
    placeholder: 'Authentication 또는 Authorization',
    acceptedAnswers: ['authorization', '권한 부여', '인가'],
    hints: [
      '사용자가 누구인지가 아니라 무엇을 할 수 있는지 묻습니다.',
      '영문은 Authorization입니다.',
    ],
    explanation:
      'UI 검증이나 객체 ID의 난독화는 권한 검사를 대신할 수 없습니다.',
    defense:
      '서버는 매 요청에서 인증된 주체와 대상 객체의 소유·역할 관계를 확인합니다.',
  },
  {
    id: 'xss-csrf-defense',
    level: 'intermediate',
    order: 10,
    title: '입력 처리, XSS와 CSRF 방어',
    eyebrow: '중급 대표 실습 02',
    duration: '14분',
    goal: '출력 인코딩과 CSRF 방어가 해결하는 위험을 구분합니다.',
    theory: [
      '사이트 간 스크립팅(XSS)은 신뢰하지 않은 입력이 코드로 해석될 때 발생합니다.',
      'CSRF는 브라우저가 인증 정보를 자동 전송하는 성질을 악용해 원치 않는 요청을 유도합니다.',
      'XSS에는 문맥별 출력 인코딩과 CSP, CSRF에는 SameSite 쿠키·토큰·Origin 검사가 핵심입니다.',
    ],
    devtoolsTab: 'storage',
    mockTask:
      '격리 미리보기에서 위험 문자열이 텍스트로 표시되는지 확인하고 Cookie의 SameSite 값을 읽으세요.',
    f12Steps: [
      '격리된 미리보기 iframe에는 allow-scripts 권한이 없음을 확인합니다.',
      'Storage에서 훈련용 쿠키의 SameSite=Strict를 확인합니다.',
      '외부 URL이나 실제 계정에는 어떤 요청도 보내지 않습니다.',
    ],
    question:
      'HTML 문맥에서 신뢰하지 않은 입력을 코드가 아닌 문자로 표시하는 기본 원칙은?',
    placeholder: '예: 출력 인코딩',
    acceptedAnswers: [
      '출력 인코딩',
      '이스케이프',
      'escaping',
      'escape',
      'output encoding',
    ],
    hints: [
      '< 기호를 &lt;처럼 문자로 바꾸는 처리입니다.',
      '출력할 문맥에 맞게 인코딩합니다.',
    ],
    explanation:
      'XSS와 CSRF는 원인과 방어가 다르며 하나의 대책만으로 둘 다 해결할 수 없습니다.',
    defense:
      '프레임워크 기본 이스케이프를 유지하고 위험한 HTML API를 피하며 상태 변경 요청에 CSRF 방어를 적용합니다.',
  },
  {
    id: 'mini-ctf',
    level: 'ctf',
    order: 11,
    title: '미니 CTF: 잠긴 보고서',
    eyebrow: '마지막 미니 CTF',
    duration: '15분',
    goal: 'Elements, Sources, Network, Storage의 단서를 조합해 하나의 교육용 플래그를 완성합니다.',
    theory: [
      '이 CTF는 앱 내부의 가상 서비스와 고정된 장난감 데이터만 사용합니다.',
      '각 패널의 단서는 단독으로 비밀이 아니며 모두 조합해야 체크포인트가 됩니다.',
      '발견 과정 뒤에는 반드시 누락된 방어 경계를 찾아야 합니다.',
    ],
    devtoolsTab: 'elements',
    mockTask:
      '각 패널에서 사용자 ID, 필드명, 리소스 ID, 조각을 모아 WHITE{user:resource:fragment} 형식으로 입력하세요.',
    f12Steps: [
      '모의 Elements에서 data-user-id를 찾습니다.',
      'Sources와 Network에서 ownerId와 resourceId를 확인합니다.',
      'Storage의 ctf_fragment를 조합합니다. 외부 도구나 스캔은 필요하지 않습니다.',
    ],
    question: '네 패널의 단서를 조합한 최종 플래그를 입력하세요.',
    placeholder: 'WHITE{user:resource:fragment}',
    acceptedAnswers: ['white{trainee-07:report-3:safe}'],
    hints: [
      'Elements의 main 요소에서 data-user-id를 찾으세요.',
      'Sources의 authorizationField와 Network 응답의 resourceId를 확인하세요.',
      'Storage의 ctf_fragment를 끝에 붙이면 WHITE{trainee-07:report-3:SAFE}입니다.',
    ],
    explanation:
      '클라이언트에 흩어진 단서는 모두 사용자가 읽을 수 있으므로 비밀이나 권한 판단 근거가 될 수 없습니다.',
    defense:
      '서버가 객체 소유권을 확인하고 응답을 최소화하며 클라이언트 저장소에 보안 비밀을 두지 않아야 합니다.',
  },
];

export const courseSections = [
  {
    id: 'foundation',
    title: '기초 과정',
    description: '브라우저 도구와 신뢰 경계',
  },
  {
    id: 'intermediate',
    title: '중급 대표 실습',
    description: '검증·입력·권한 방어',
  },
  { id: 'ctf', title: '미니 CTF', description: '단서 조합과 방어 분석' },
] as const;

export const advancedRoadmap = [
  '고급 디버깅과 Source Map',
  'CSP·Same-Origin Policy·CORS',
  '세션과 토큰 보안',
  '고급 XSS·CSRF·접근 제어',
  '안전한 API 설계',
  '취약점 보고서와 여러 CTF',
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
