import { ArrowLeft, Bug, CircleAlert, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ScoreTracingLab() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <script defer src="/score-tracer.js" />
      <div className="mx-auto max-w-5xl">
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-cyan-800 hover:bg-cyan-50"
          href="/"
        >
          <ArrowLeft className="size-4" />
          화이트랩으로 돌아가기
        </Link>
        <header className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
            실제 F12 대표 실습
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            DOM 변경 중단점으로 점수 로직 추적
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            이 페이지는 읽기 쉬운 전용 스크립트{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
              score-tracer.js
            </code>
            만 사용합니다. 실제 비밀이나 외부 요청은 없습니다.
          </p>
          <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <p>
              이 실습 페이지에서만 진행하세요. DevTools가 열렸는지는 탐지하지
              않으며 직접 발견한 변수명으로 학습을 확인합니다.
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            aria-labelledby="training-game-title"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  교육용 퀴즈 게임
                </p>
                <h2 className="mt-1 text-xl font-bold" id="training-game-title">
                  안전한 점수판
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                로컬 장난감 상태
              </span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold text-slate-500">점수</p>
                <p
                  className="mt-2 font-mono text-4xl font-bold text-cyan-800"
                  data-training-state="client-score"
                  id="score-value"
                >
                  0
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold text-slate-500">골드</p>
                <p
                  className="mt-2 font-mono text-4xl font-bold text-slate-800"
                  id="gold-value"
                >
                  12
                </p>
              </div>
            </div>
            <fieldset className="mt-7">
              <legend className="text-sm font-bold">
                문제: 신뢰 가능한 점수 검증 위치는?
              </legend>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  defaultChecked
                  name="answer"
                  type="radio"
                  value="server"
                />
                서버에서 다시 검증한다
              </label>
              <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input name="answer" type="radio" value="dom" />
                DOM의 숫자만 믿는다
              </label>
            </fieldset>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                className="min-h-11 rounded-lg bg-cyan-700 px-5 text-sm font-semibold text-white hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                id="solve-button"
                type="button"
              >
                정답 제출 · 점수 +1
              </button>
              <button
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                id="reset-score-button"
                type="button"
              >
                점수 초기화
              </button>
            </div>
            <output
              className="mt-4 block min-h-6 text-sm text-slate-600"
              id="lab-status"
            >
              DOM 중단점을 설정한 뒤 정답 제출 버튼을 누르세요.
            </output>
          </section>

          <aside
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="f12-guide-title"
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">
              <Bug className="size-4" />
              F12 체크리스트
            </p>
            <h2 className="mt-2 text-lg font-bold" id="f12-guide-title">
              어디에서 멈추는지 찾기
            </h2>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <GuideStep number="1">
                Elements(요소)에서 <code>#score-value</code>를 선택합니다.
              </GuideStep>
              <GuideStep number="2">
                우클릭 → Break on(중단 위치) → subtree modifications(하위 트리
                수정)를 선택합니다.
              </GuideStep>
              <GuideStep number="3">
                정답 제출 버튼을 누릅니다. Sources(소스)의{' '}
                <code>score-tracer.js</code>에서 실행이 멈춥니다.
              </GuideStep>
              <GuideStep number="4">
                Call Stack(호출 스택)과 Scope(범위)에서 지역 변수 이름을
                확인합니다.
              </GuideStep>
            </ol>
            <div className="mt-6 flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-950">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <p>
                브라우저 버전에 따라 메뉴 표현이 다를 수 있습니다. Chrome과 Edge
                모두 같은 개념의 DOM 변경 중단점을 제공합니다.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold">관찰 포인트</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Elements에서 숫자를 999로 직접 바꾸면 화면 표현만 달라집니다. 반면
            제출 버튼은{' '}
            <code className="font-mono">
              solveTrainingQuestion → applyScoreIncrement → updateScoreDom
            </code>{' '}
            순서로 상태를 계산하고 DOM을 갱신합니다. 새로고침하거나 초기화하면
            장난감 상태는 다시 0이 됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}

function GuideStep({
  children,
  number,
}: {
  children: React.ReactNode;
  number: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full border border-cyan-200 bg-cyan-50 font-mono text-xs font-bold text-cyan-800">
        {number}
      </span>
      <span>{children}</span>
    </li>
  );
}
