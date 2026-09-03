'use client';

import { useReducer, useState } from 'react';
import {
  Bug,
  CircleDot,
  Play,
  RefreshCw,
  Send,
  TerminalSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createMockDevToolsState, mockDevToolsReducer } from '@/lib/lab-engine';
import type { DevToolsTab } from '@/lib/curriculum';

const tabs: { id: DevToolsTab; label: string }[] = [
  { id: 'elements', label: 'Elements' },
  { id: 'console', label: 'Console' },
  { id: 'sources', label: 'Sources' },
  { id: 'network', label: 'Network' },
  { id: 'storage', label: 'Storage' },
];

export function MockDevTools({ initialTab }: { initialTab: DevToolsTab }) {
  const [state, dispatch] = useReducer(
    mockDevToolsReducer,
    initialTab,
    createMockDevToolsState,
  );
  const [command, setCommand] = useState('');

  return (
    <section
      aria-label="교육용 모의 개발자 도구"
      className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 text-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <TerminalSquare aria-hidden="true" className="size-4 text-cyan-400" />
          모의 DevTools
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
            교육용 · 외부 요청 없음
          </span>
          <Button
            aria-label="모의 DevTools 초기화"
            className="border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800"
            onClick={() => dispatch({ type: 'reset', tab: initialTab })}
            size="icon-xs"
            variant="outline"
          >
            <RefreshCw aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Tabs
        onValueChange={(value) =>
          dispatch({ type: 'select-tab', tab: value as DevToolsTab })
        }
        value={state.activeTab}
      >
        <TabsList
          className="h-auto w-full justify-start overflow-x-auto rounded-none border-b border-slate-700 bg-slate-900 p-0"
          variant="line"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              className="min-h-11 flex-none px-4 font-mono text-xs text-slate-400 data-active:text-white"
              key={tab.id}
              value={tab.id}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent className="min-h-80" value="elements">
          <div className="grid min-h-80 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
              <button
                className={`block rounded px-1 text-left ${state.selectedElement === 'main' ? 'bg-cyan-950 text-cyan-100' : 'text-slate-400'}`}
                onClick={() =>
                  dispatch({ type: 'select-element', element: 'main' })
                }
                type="button"
              >
                &lt;main data-training-scope=&quot;this-app-only&quot;
                data-user-id=&quot;trainee-07&quot;&gt;
              </button>
              <button
                className={`ml-5 block rounded px-1 text-left ${state.selectedElement === 'score' ? 'bg-cyan-950 text-cyan-100' : 'text-cyan-300'}`}
                onClick={() =>
                  dispatch({ type: 'select-element', element: 'score' })
                }
                type="button"
              >
                &lt;span id=&quot;score&quot;
                data-source=&quot;client-state&quot;&gt;1&lt;/span&gt;
              </button>
              <span className="block text-slate-400">&lt;/main&gt;</span>
            </div>
            <div className="border-t border-slate-700 bg-slate-900/80 p-5 md:border-l md:border-t-0">
              <p className="font-mono text-xs text-cyan-300">선택한 요소</p>
              {state.selectedElement === 'main' ? (
                <dl className="mt-4 space-y-3 text-xs">
                  <DataRow label="training-scope" value="this-app-only" />
                  <DataRow label="user-id" value="trainee-07" />
                </dl>
              ) : (
                <dl className="mt-4 space-y-3 text-xs">
                  <DataRow label="selector" value="span#score" />
                  <DataRow label="data-source" value="client-state" />
                  <DataRow label="표시 값" value="1 (수정 가능)" />
                </dl>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent className="min-h-80 p-5" value="console">
          <div
            className="min-h-52 rounded-lg border border-slate-700 bg-black/30 p-4 font-mono text-xs leading-6"
            aria-live="polite"
          >
            {state.consoleLines.length === 0 ? (
              <span className="text-slate-500">콘솔이 비었습니다.</span>
            ) : (
              state.consoleLines.map((line, index) => (
                <div
                  className={
                    line.startsWith('>') ? 'text-cyan-300' : 'text-slate-300'
                  }
                  key={`${line}-${index}`}
                >
                  {line || <span>&nbsp;</span>}
                </div>
              ))
            )}
          </div>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!command.trim()) return;
              dispatch({ type: 'console', command });
              setCommand('');
            }}
          >
            <label className="sr-only" htmlFor="mock-console-input">
              모의 Console 명령
            </label>
            <Input
              autoComplete="off"
              className="h-10 border-slate-600 bg-slate-900 font-mono text-slate-100 placeholder:text-slate-500"
              id="mock-console-input"
              onChange={(event) => setCommand(event.target.value)}
              placeholder="help 또는 state.score"
              value={command}
            />
            <Button
              className="h-10 bg-cyan-600 text-slate-950 hover:bg-cyan-500"
              type="submit"
            >
              실행
            </Button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            eval 없이 허용된 네 가지 명령만 처리합니다.
          </p>
        </TabsContent>

        <TabsContent className="min-h-80" value="sources">
          <div className="grid min-h-80 lg:grid-cols-[180px_minmax(0,1fr)_250px]">
            <div className="border-b border-slate-700 p-4 font-mono text-xs text-slate-400 lg:border-b-0 lg:border-r">
              <p className="mb-3 text-slate-500">Page</p>
              <p className="text-cyan-300">▾ white-lab</p>
              <p className="ml-4 mt-2">score-tracer.js</p>
            </div>
            <div className="overflow-x-auto border-b border-slate-700 p-4 font-mono text-xs leading-7 lg:border-b-0 lg:border-r">
              <SourceLine number={5}>
                function updateScoreDom(nextScore) {'{'}
              </SourceLine>
              <SourceLine highlight={state.paused} number={6}>
                scoreElement.textContent = String(nextScore);
              </SourceLine>
              <SourceLine number={7}>{'}'}</SourceLine>
              <SourceLine number={9}>
                const authorizationField = &apos;ownerId&apos;;
              </SourceLine>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  onClick={() => dispatch({ type: 'toggle-breakpoint' })}
                  size="sm"
                  variant="outline"
                >
                  <CircleDot
                    className={state.breakpointEnabled ? 'text-red-400' : ''}
                  />
                  {state.breakpointEnabled ? '중단점 켜짐' : '6번 줄 중단점'}
                </Button>
                <Button
                  className="bg-cyan-600 text-slate-950 hover:bg-cyan-500"
                  onClick={() => dispatch({ type: 'run-score' })}
                  size="sm"
                >
                  <Play /> 실행
                </Button>
              </div>
            </div>
            <div className="bg-slate-900/70 p-4 text-xs">
              {state.paused ? (
                <div aria-live="polite">
                  <p className="flex items-center gap-2 font-semibold text-amber-300">
                    <Bug className="size-4" />
                    중단점에서 일시정지
                  </p>
                  <p className="mt-5 text-slate-500">Call Stack</p>
                  <ol className="mt-2 space-y-1 font-mono">
                    <li>updateScoreDom</li>
                    <li>applyScoreIncrement</li>
                    <li>solveTrainingQuestion</li>
                  </ol>
                  <p className="mt-5 text-slate-500">Scope · Local</p>
                  <p className="mt-2 font-mono text-cyan-300">nextScore: 1</p>
                </div>
              ) : (
                <p className="leading-6 text-slate-500">
                  중단점을 켜고 실행하면 호출 스택과 지역 변수가 나타납니다.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent className="min-h-80 p-5" value="network">
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full min-w-[520px] text-left font-mono text-xs">
              <thead className="bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700">
                  <td className="px-3 py-3 text-cyan-300">/training/profile</td>
                  <td className="px-3 py-3">GET</td>
                  <td className="px-3 py-3">
                    {state.requestSent ? '200' : '—'}
                  </td>
                  <td className="px-3 py-3">mock/json</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button
            className="mt-4 bg-cyan-600 text-slate-950 hover:bg-cyan-500"
            onClick={() => dispatch({ type: 'send-request' })}
            size="sm"
          >
            <Send />
            모의 요청 보내기
          </Button>
          {state.requestSent && (
            <pre
              className="mt-4 overflow-x-auto rounded-lg border border-slate-700 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-300"
              aria-live="polite"
            >
              <code>{`{
  "status": 200,
  "userId": "trainee-07",
  "role": "learner",
  "ownerId": "trainee-07",
  "resourceId": "report-3"
}`}</code>
            </pre>
          )}
        </TabsContent>

        <TabsContent className="min-h-80 p-5" value="storage">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">저장소 종류</legend>
            {(['cookie', 'local', 'session'] as const).map((kind) => (
              <Button
                className={
                  state.selectedStorage === kind
                    ? 'bg-cyan-600 text-slate-950'
                    : 'border-slate-600 bg-slate-900 text-slate-300'
                }
                key={kind}
                onClick={() =>
                  dispatch({ type: 'select-storage', storage: kind })
                }
                size="sm"
                variant={state.selectedStorage === kind ? 'default' : 'outline'}
              >
                {kind === 'cookie'
                  ? 'Cookies'
                  : kind === 'local'
                    ? 'Local Storage'
                    : 'Session Storage'}
              </Button>
            ))}
          </fieldset>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full min-w-[520px] text-left font-mono text-xs">
              <thead className="bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Key</th>
                  <th className="px-3 py-2">Value</th>
                  <th className="px-3 py-2">특징</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {state.selectedStorage === 'local' && (
                  <>
                    <StorageRow
                      name="white-lab-progress-v1"
                      note="기기에 유지"
                      value="{version: 1, …}"
                    />
                    <StorageRow
                      name="ctf_fragment"
                      note="비밀 저장 금지"
                      value="SAFE"
                    />
                  </>
                )}
                {state.selectedStorage === 'session' && (
                  <StorageRow
                    name="practice-tab"
                    note="탭 종료 시 삭제"
                    value="sources"
                  />
                )}
                {state.selectedStorage === 'cookie' && (
                  <StorageRow
                    name="training_session"
                    note="SameSite=Strict"
                    value="toy-session"
                  />
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 break-all font-mono text-slate-200">{value}</dd>
    </div>
  );
}

function SourceLine({
  children,
  highlight = false,
  number,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  number: number;
}) {
  return (
    <div
      className={highlight ? '-mx-2 bg-amber-950/60 px-2 text-amber-100' : ''}
    >
      <span className="mr-4 inline-block w-4 text-right text-slate-600">
        {number}
      </span>
      {children}
    </div>
  );
}

function StorageRow({
  name,
  note,
  value,
}: {
  name: string;
  note: string;
  value: string;
}) {
  return (
    <tr>
      <td className="px-3 py-3 text-cyan-300">{name}</td>
      <td className="px-3 py-3">{value}</td>
      <td className="px-3 py-3 text-slate-500">{note}</td>
    </tr>
  );
}
