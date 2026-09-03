import type { DevToolsTab } from './curriculum';

export interface MockDevToolsState {
  activeTab: DevToolsTab;
  selectedElement: 'main' | 'score';
  consoleLines: string[];
  breakpointEnabled: boolean;
  paused: boolean;
  requestSent: boolean;
  selectedStorage: 'cookie' | 'local' | 'session';
}

export type MockDevToolsAction =
  | { type: 'select-tab'; tab: DevToolsTab }
  | { type: 'select-element'; element: 'main' | 'score' }
  | { type: 'console'; command: string }
  | { type: 'toggle-breakpoint' }
  | { type: 'run-score' }
  | { type: 'send-request' }
  | { type: 'select-storage'; storage: 'cookie' | 'local' | 'session' }
  | { type: 'reset'; tab: DevToolsTab };

export function createMockDevToolsState(tab: DevToolsTab): MockDevToolsState {
  return {
    activeTab: tab,
    selectedElement: 'main',
    consoleLines: ['화이트랩 콘솔 · help로 허용 명령 확인'],
    breakpointEnabled: false,
    paused: false,
    requestSent: false,
    selectedStorage: 'local',
  };
}

export function runAllowedConsoleCommand(command: string): string {
  const normalized = command.trim().toLowerCase();
  const commands: Record<string, string> = {
    help: '허용 명령: state.score, state.serverScore, state.gold, clear',
    'state.score': '1  // 화면에 표시되는 클라이언트 값',
    'state.serverscore': '1  // 서버가 다시 계산한 고정 실습 값',
    'state.gold': '12  // 교육용 장난감 데이터',
    clear: '',
  };
  return Object.hasOwn(commands, normalized)
    ? commands[normalized]
    : '허용되지 않은 명령입니다. help를 입력하세요.';
}

export function mockDevToolsReducer(
  state: MockDevToolsState,
  action: MockDevToolsAction,
): MockDevToolsState {
  switch (action.type) {
    case 'select-tab':
      return { ...state, activeTab: action.tab };
    case 'select-element':
      return { ...state, selectedElement: action.element };
    case 'console': {
      const result = runAllowedConsoleCommand(action.command);
      return {
        ...state,
        consoleLines:
          action.command.trim().toLowerCase() === 'clear'
            ? []
            : [...state.consoleLines, `> ${action.command}`, result],
      };
    }
    case 'toggle-breakpoint':
      return {
        ...state,
        breakpointEnabled: !state.breakpointEnabled,
        paused: false,
      };
    case 'run-score':
      return { ...state, paused: state.breakpointEnabled };
    case 'send-request':
      return { ...state, requestSent: true };
    case 'select-storage':
      return { ...state, selectedStorage: action.storage };
    case 'reset':
      return createMockDevToolsState(action.tab);
  }
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replaceAll(/\s+/g, ' ');
}

export function validateAnswer(
  answer: string,
  acceptedAnswers: string[],
): boolean {
  const normalized = normalizeAnswer(answer);
  return acceptedAnswers.some(
    (candidate) => normalizeAnswer(candidate) === normalized,
  );
}
