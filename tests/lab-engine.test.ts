import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createMockDevToolsState,
  mockDevToolsReducer,
  runAllowedConsoleCommand,
  validateAnswer,
} from '../lib/lab-engine.ts';

void test('Console은 허용 목록 명령만 실행한다', () => {
  assert.match(runAllowedConsoleCommand('state.gold'), /12/);
  assert.match(
    runAllowedConsoleCommand('fetch("https://example.com")'),
    /허용되지 않은/,
  );
});

void test('중단점 상태 전환에서만 실행이 일시정지된다', () => {
  const initial = createMockDevToolsState('sources');
  const running = mockDevToolsReducer(initial, { type: 'run-score' });
  assert.equal(running.paused, false);
  const armed = mockDevToolsReducer(initial, { type: 'toggle-breakpoint' });
  const paused = mockDevToolsReducer(armed, { type: 'run-score' });
  assert.equal(paused.paused, true);
});

void test('정답과 플래그를 공백·대소문자와 무관하게 검증한다', () => {
  assert.equal(validateAnswer('  NextScore ', ['nextscore']), true);
  assert.equal(
    validateAnswer('WHITE{trainee-07:report-3:SAFE}', [
      'white{trainee-07:report-3:safe}',
    ]),
    true,
  );
  assert.equal(validateAnswer('wrong', ['nextscore']), false);
});
