import assert from 'node:assert/strict';

const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
const cdpUrl = process.env.CDP_URL ?? 'http://127.0.0.1:9222';
const results = [];

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function createCdpClient() {
  const targetResponse = await fetch(
    `${cdpUrl}/json/new?${encodeURIComponent('about:blank')}`,
    { method: 'PUT' },
  );
  assert.equal(targetResponse.ok, true, 'Chrome CDP target creation failed');
  const target = await targetResponse.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let sequence = 0;
  const pending = new Map();
  const waiters = new Map();

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const handler = pending.get(message.id);
      if (!handler) return;
      pending.delete(message.id);
      if (message.error) handler.reject(new Error(message.error.message));
      else handler.resolve(message.result);
      return;
    }
    const waiter = waiters.get(message.method);
    if (waiter) {
      waiters.delete(message.method);
      waiter(message.params);
    }
  });

  function send(method, params = {}) {
    const id = ++sequence;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) =>
      pending.set(id, { resolve, reject }),
    );
  }

  function once(method) {
    return new Promise((resolve) => waiters.set(method, resolve));
  }

  await Promise.all([send('Page.enable'), send('Runtime.enable')]);
  return { send, once, close: () => socket.close() };
}

const cdp = await createCdpClient();

async function evaluate(expression) {
  const response = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(
      response.exceptionDetails.text ?? 'Browser evaluation failed',
    );
  }
  return response.result.value;
}

async function navigate(path) {
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: new URL(path, appUrl).href });
  await loaded;
  await delay(350);
}

async function reload() {
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.reload', { ignoreCache: true });
  await loaded;
  await delay(350);
}

async function viewport(width, height, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function scenario(name, action) {
  try {
    const details = await action();
    results.push({ name, status: 'passed', details });
  } catch (error) {
    results.push({ name, status: 'failed', error: String(error) });
    throw error;
  }
}

await scenario('responsive-layout', async () => {
  const checks = [];
  for (const size of [
    { width: 390, height: 844, mobile: true },
    { width: 768, height: 1024, mobile: false },
    { width: 1440, height: 900, mobile: false },
  ]) {
    await viewport(size.width, size.height, size.mobile);
    await navigate('/');
    const metrics = await evaluate(`(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
      hasLessonTitle: Boolean(document.querySelector('#lesson-title')),
      menuVisible: (() => {
        const button = document.querySelector('[aria-controls="course-navigation"]');
        return button ? button.getBoundingClientRect().width > 0 : false;
      })()
    }))()`);
    assert.equal(
      metrics.noHorizontalOverflow,
      true,
      `${size.width}px overflow`,
    );
    assert.equal(metrics.hasLessonTitle, true);
    if (size.width < 1024) assert.equal(metrics.menuVisible, true);
    checks.push(metrics);
  }
  return checks;
});

await scenario('keyboard-focus', async () => {
  await viewport(1440, 900);
  await navigate('/');
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
  });
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
  });
  const focus = await evaluate(`(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    return { text: element.textContent.trim(), outline: style.outlineStyle, shadow: style.boxShadow };
  })()`);
  assert.match(focus.text, /학습 내용으로 건너뛰기/);
  assert.notEqual(focus.outline === 'none' && focus.shadow === 'none', true);
  return focus;
});

await scenario('semantic-accessibility', async () => {
  await cdp.send('Accessibility.enable');
  const tree = await cdp.send('Accessibility.getFullAXTree');
  const visibleNodes = tree.nodes.filter((node) => !node.ignored);
  const interactiveRoles = new Set([
    'button',
    'link',
    'radio',
    'tab',
    'textbox',
  ]);
  const unnamed = visibleNodes.filter(
    (node) =>
      interactiveRoles.has(node.role?.value) && !node.name?.value?.trim(),
  );
  const roles = new Set(visibleNodes.map((node) => node.role?.value));
  assert.equal(unnamed.length, 0, 'unnamed interactive accessibility node');
  assert.equal(roles.has('main'), true);
  assert.equal(roles.has('navigation'), true);
  assert.equal(roles.has('heading'), true);
  return { unnamedInteractive: unnamed.length, landmarkRolesPresent: true };
});

await scenario('progress-hints-and-reset', async () => {
  await navigate('/');
  await evaluate(`localStorage.removeItem('white-lab-progress-v1')`);
  await reload();
  const completed = await evaluate(`(async () => {
    const input = document.querySelector('#answer-scope-and-ethics');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'this-app-only');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    input.form.requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 120));
    return JSON.parse(localStorage.getItem('white-lab-progress-v1'));
  })()`);
  assert.deepEqual(completed.completedLessonIds, ['scope-and-ethics']);

  const hintAndReset = await evaluate(`(async () => {
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('브라우저와 서버의 신뢰 경계')).click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('힌트 한 단계 열기')).click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const hintVisible = document.body.innerText.includes('사용자가 직접 제어하기 어려운 쪽');
    const input = document.querySelector('#answer-trust-boundary');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'wrong');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('현재 실습 초기화')).click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { hintVisible, value: document.querySelector('#answer-trust-boundary').value, hintCountReset: document.body.innerText.includes('단계별 힌트 0 /') };
  })()`);
  assert.equal(hintAndReset.hintVisible, true);
  assert.equal(hintAndReset.value, '');
  assert.equal(hintAndReset.hintCountReset, true);
  return { completed, hintAndReset };
});

await scenario('corrupted-storage-recovery', async () => {
  await evaluate(
    `localStorage.setItem('white-lab-progress-v1', '{broken json')`,
  );
  await reload();
  const recovery = await evaluate(`(() => ({
    banner: document.body.innerText.includes('안전한 초기값으로 복구'),
    stored: JSON.parse(localStorage.getItem('white-lab-progress-v1'))
  }))()`);
  assert.equal(recovery.banner, true);
  assert.deepEqual(recovery.stored.completedLessonIds, []);
  return recovery;
});

await scenario('mock-devtools-breakpoint', async () => {
  const firstFour = [
    'scope-and-ethics',
    'trust-boundary',
    'elements-dom',
    'console-state',
  ];
  await evaluate(
    `localStorage.setItem('white-lab-progress-v1', JSON.stringify({ version: 1, completedLessonIds: ${JSON.stringify(firstFour)}, updatedAt: new Date().toISOString() }))`,
  );
  await reload();
  const paused = await evaluate(`(async () => {
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('Sources, 중단점과 호출 스택')).click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('6번 줄 중단점')).click();
    [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === '실행').click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    return document.body.innerText.includes('중단점에서 일시정지') && document.body.innerText.includes('nextScore: 1');
  })()`);
  assert.equal(paused, true);
  return { paused };
});

await scenario('mini-ctf-completion-and-full-reset', async () => {
  const firstTen = [
    'scope-and-ethics',
    'trust-boundary',
    'elements-dom',
    'console-state',
    'sources-debugging',
    'dom-breakpoint-score',
    'network-http',
    'browser-storage',
    'validation-access',
    'xss-csrf-defense',
  ];
  await evaluate(
    `localStorage.setItem('white-lab-progress-v1', JSON.stringify({ version: 1, completedLessonIds: ${JSON.stringify(firstTen)}, updatedAt: new Date().toISOString() }))`,
  );
  await reload();
  const result = await evaluate(`(async () => {
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('미니 CTF: 잠긴 보고서')).click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const input = document.querySelector('#answer-mini-ctf');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'WHITE{trainee-07:report-3:SAFE}');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    input.form.requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const ctfCompleted = JSON.parse(localStorage.getItem('white-lab-progress-v1')).completedLessonIds.includes('mini-ctf');
    [...document.querySelectorAll('button')].find((button) => button.textContent.includes('전체 진도 초기화')).click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === '모두 초기화').click();
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      ctfCompleted,
      reset: localStorage.getItem('white-lab-progress-v1') === null,
      dialogClosed: !document.body.innerText.includes('완료한 수업과 잠금 해제 기록이 이 기기에서 삭제됩니다.')
    };
  })()`);
  assert.equal(result.ctfCompleted, true);
  assert.equal(result.reset, true);
  assert.equal(result.dialogClosed, true);
  return result;
});

await scenario('f12-score-page', async () => {
  await viewport(1280, 900);
  await navigate('/lab/score/');
  const lab = await evaluate(`(async () => {
    document.querySelector('#solve-button').click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const script = await fetch('/score-tracer.js').then((response) => response.text());
    const externalResources = performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => {
      const url = new URL(name);
      return url.origin !== location.origin;
    });
    return {
      score: document.querySelector('#score-value').textContent,
      status: document.querySelector('#lab-status').textContent,
      stableNames: ['updateScoreDom', 'applyScoreIncrement', 'solveTrainingQuestion', 'nextScore'].every((name) => script.includes(name)),
      externalResources
    };
  })()`);
  assert.equal(lab.score, '1');
  assert.match(lab.status, /정답입니다/);
  assert.equal(lab.stableNames, true);
  assert.deepEqual(lab.externalResources, []);
  return lab;
});

await scenario('f12-dom-subtree-breakpoint', async () => {
  await navigate('/lab/score/');
  await Promise.all([cdp.send('DOM.enable'), cdp.send('Debugger.enable')]);
  const documentNode = await cdp.send('DOM.getDocument', { depth: -1 });
  const scoreNode = await cdp.send('DOM.querySelector', {
    nodeId: documentNode.root.nodeId,
    selector: '#score-value',
  });
  await cdp.send('DOMDebugger.setDOMBreakpoint', {
    nodeId: scoreNode.nodeId,
    type: 'subtree-modified',
  });

  const pausedEvent = Promise.race([
    cdp.once('Debugger.paused'),
    delay(5000).then(() => {
      throw new Error('DOM breakpoint did not pause within 5 seconds');
    }),
  ]);
  void cdp
    .send('Runtime.evaluate', {
      expression: `document.querySelector('#solve-button').click()`,
    })
    .catch(() => undefined);
  const paused = await pausedEvent;
  const topFrame = paused.callFrames[0];
  const localScope = topFrame.scopeChain.find(
    (scope) => scope.type === 'local',
  );
  assert.ok(localScope?.object?.objectId, 'local scope missing');
  const properties = await cdp.send('Runtime.getProperties', {
    objectId: localScope.object.objectId,
    ownProperties: true,
  });
  const nextScore = properties.result.find(
    (property) => property.name === 'nextScore',
  );
  const stack = paused.callFrames
    .slice(0, 3)
    .map((frame) => frame.functionName);
  assert.equal(topFrame.functionName, 'updateScoreDom');
  assert.equal(nextScore?.value?.value, 1);
  assert.deepEqual(stack, [
    'updateScoreDom',
    'applyScoreIncrement',
    'solveTrainingQuestion',
  ]);
  await cdp.send('Debugger.resume');
  await delay(50);
  await cdp.send('DOMDebugger.removeDOMBreakpoint', {
    nodeId: scoreNode.nodeId,
    type: 'subtree-modified',
  });
  return { functionName: topFrame.functionName, nextScore: 1, stack };
});

cdp.close();
console.log(JSON.stringify({ status: 'passed', scenarios: results }, null, 2));
