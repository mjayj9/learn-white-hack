'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MockDevTools } from '@/components/mock-devtools';
import { validateAnswer } from '@/lib/lab-engine';
import type { Lesson } from '@/lib/curriculum';

export function LessonView({
  completed,
  lesson,
  onComplete,
}: {
  completed: boolean;
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
}) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>(
    completed ? 'correct' : 'idle',
  );
  const [hintCount, setHintCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  function resetExercise() {
    setAnswer('');
    setFeedback(completed ? 'correct' : 'idle');
    setHintCount(0);
    setResetKey((value) => value + 1);
  }

  return (
    <article className="min-w-0 space-y-6" aria-labelledby="lesson-title">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-cyan-700">{lesson.eyebrow}</span>
          <span aria-hidden="true">·</span>
          <span>약 {lesson.duration}</span>
          {completed && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              <CheckCircle2 aria-hidden="true" className="size-3.5" /> 완료
            </span>
          )}
        </div>
        <h1
          className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          id="lesson-title"
        >
          {lesson.title}
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{lesson.goal}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={<BookOpen />} title="이번 수업의 목표">
            {lesson.goal}
          </InfoCard>
          <InfoCard icon={<ShieldCheck />} tone="safe" title="합법적 실습 범위">
            이 앱 내부와 본인이 소유하거나 명시적으로 허가받은 시스템에서만
            연습하세요.
          </InfoCard>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <SectionHeading number="01" title="3–5분 핵심 이론" />
        <ul className="mt-5 space-y-4">
          {lesson.theory.map((paragraph) => (
            <li className="flex gap-3 leading-7 text-slate-700" key={paragraph}>
              <span
                aria-hidden="true"
                className="mt-3 size-1.5 shrink-0 rounded-full bg-cyan-600"
              />
              <span>{paragraph}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mock-practice-title">
        <div className="mb-3 flex items-start gap-3 px-1">
          <span className="font-mono text-xs font-bold text-cyan-700">02</span>
          <div>
            <h2 className="font-bold" id="mock-practice-title">
              앱 내부 모의 실습
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {lesson.mockTask}
            </p>
          </div>
        </div>
        <MockDevTools
          initialTab={lesson.devtoolsTab}
          key={`${lesson.id}-${resetKey}`}
        />
      </section>

      {lesson.id === 'xss-csrf-defense' && <SafeXssPreview />}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <SectionHeading number="03" title="실제 브라우저 F12 실습" />
        <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          Chrome·Edge 기준입니다. 메뉴는 <strong>한국어(English)</strong>로 함께
          표기하며 브라우저 버전에 따라 이름과 위치가 조금 다를 수 있습니다.
        </p>
        <ol className="mt-5 space-y-4">
          {lesson.f12Steps.map((step, index) => (
            <li
              className="flex gap-3 text-sm leading-6 text-slate-700"
              key={step}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-cyan-200 bg-cyan-50 font-mono text-xs font-bold text-cyan-800">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {lesson.id === 'dom-breakpoint-score' && (
          <a
            className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
            href="/lab/score/"
            target="_blank"
            rel="noreferrer"
          >
            전용 점수 추적 실습 열기{' '}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        )}
      </section>

      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
        id="checkpoint"
      >
        <SectionHeading number="04" title="확인 문제" />
        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (validateAnswer(answer, lesson.acceptedAnswers)) {
              setFeedback('correct');
              onComplete(lesson.id);
            } else {
              setFeedback('incorrect');
            }
          }}
        >
          <label
            className="text-sm font-semibold"
            htmlFor={`answer-${lesson.id}`}
          >
            {lesson.question}
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              aria-describedby={`feedback-${lesson.id}`}
              aria-invalid={feedback === 'incorrect'}
              className="h-11 flex-1"
              id={`answer-${lesson.id}`}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={lesson.placeholder}
              value={answer}
            />
            <Button
              className="h-11 bg-cyan-700 px-5 text-white hover:bg-cyan-800"
              type="submit"
            >
              확인하기
            </Button>
          </div>
          <div aria-live="polite" id={`feedback-${lesson.id}`}>
            {feedback === 'incorrect' && (
              <p className="mt-3 flex items-center gap-2 text-sm text-red-700">
                <CircleAlert className="size-4" />
                아직 맞지 않습니다. 패널을 다시 관찰하거나 힌트를 한 단계 열어
                보세요.
              </p>
            )}
            {feedback === 'correct' && (
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="size-4" />
                정확합니다. 다음 수업이 잠금 해제되었습니다.
              </p>
            )}
          </div>
        </form>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-950">
              <Lightbulb className="size-4" />
              단계별 힌트 {hintCount} / {lesson.hints.length}
            </p>
            <Button
              disabled={hintCount >= lesson.hints.length}
              onClick={() =>
                setHintCount((count) =>
                  Math.min(count + 1, lesson.hints.length),
                )
              }
              size="sm"
              variant="outline"
            >
              힌트 한 단계 열기
            </Button>
          </div>
          {hintCount === 0 ? (
            <p className="mt-3 text-sm text-amber-900/70">
              정답을 바로 보여 주지 않습니다. 필요할 때 한 단계씩 여세요.
            </p>
          ) : (
            <ol className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
              {lesson.hints.slice(0, hintCount).map((hint, index) => (
                <li key={hint}>
                  <span className="mr-2 font-mono text-xs font-bold">
                    {index + 1}.
                  </span>
                  {hint}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {(feedback === 'correct' || completed) && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 lg:p-8">
          <SectionHeading number="05" title="정답·원리 해설과 방어" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                왜 이런 결과가 나왔나요?
              </h3>
              <p className="mt-2 text-sm leading-7 text-emerald-950/80">
                {lesson.explanation}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                안전한 설계 원칙
              </h3>
              <p className="mt-2 text-sm leading-7 text-emerald-950/80">
                {lesson.defense}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs leading-5 text-slate-500">
          실습 초기화는 현재 입력·힌트·모의 패널만 되돌리며 완료 기록은
          유지합니다.
        </p>
        <Button onClick={resetExercise} size="sm" variant="outline">
          <RotateCcw />
          현재 실습 초기화
        </Button>
      </div>
    </article>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold text-cyan-700">
        {number}
      </span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

function InfoCard({
  children,
  icon,
  title,
  tone = 'default',
}: {
  children: React.ReactNode;
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  tone?: 'default' | 'safe';
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${tone === 'safe' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
    >
      <span className={tone === 'safe' ? 'text-amber-700' : 'text-cyan-700'}>
        {icon}
      </span>
      <p className="mt-3 text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}

function SafeXssPreview() {
  const safeDocument =
    '<!doctype html><meta charset="utf-8"><style>body{font:14px system-ui;padding:16px;color:#334155;background:#f8fafc}code{font-family:monospace;color:#0e7490}</style><p>입력은 코드가 아닌 텍스트로 표시됩니다.</p><code>&lt;img src=x onerror=[blocked]&gt;</code>';
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-bold">격리된 입력 미리보기</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        sandbox 속성에 allow-scripts가 없으며, 위험 문자열은 이스케이프된
        텍스트로만 표시됩니다.
      </p>
      <iframe
        className="mt-4 h-28 w-full rounded-xl border border-slate-200"
        sandbox=""
        srcDoc={safeDocument}
        title="스크립트 권한이 없는 안전한 XSS 입력 미리보기"
      />
    </section>
  );
}
