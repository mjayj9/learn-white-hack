'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronRight,
  Database,
  LockKeyhole,
  Menu,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LessonView } from '@/components/lesson-view';
import {
  advancedRoadmap,
  courseSections,
  lessons,
  type Lesson,
} from '@/lib/curriculum';
import {
  completeLesson,
  createBrowserProgressStore,
  createDefaultProgress,
  getCurrentLessonId,
  isLessonUnlocked,
  type ProgressData,
} from '@/lib/progress';

interface ModelContext {
  registerTool(
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute(input: unknown): unknown;
    },
    options: { signal: AbortSignal },
  ): void | Promise<void>;
}

declare global {
  interface Document {
    readonly modelContext?: ModelContext;
  }
}

const lessonIds = lessons.map((lesson) => lesson.id);

export function LearningApp() {
  const [progress, setProgress] = useState<ProgressData>(() =>
    createDefaultProgress(),
  );
  const [selectedId, setSelectedId] = useState(lessons[0].id);
  const [hydrated, setHydrated] = useState(false);
  const [storageMessage, setStorageMessage] = useState<string | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const progressRef = useRef(progress);
  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0],
    [selectedId],
  );

  // Client-only persisted progress is intentionally loaded after hydration.
  /* oxlint-disable react/react-compiler */
  useEffect(() => {
    const store = createBrowserProgressStore();
    const result = store.read();
    setProgress(result.data);
    progressRef.current = result.data;
    setSelectedId(
      getCurrentLessonId(lessonIds, result.data.completedLessonIds),
    );
    if (result.recovered) {
      setStorageMessage(
        '손상되거나 오래된 진도 데이터를 안전한 초기값으로 복구했습니다.',
      );
      store.write(result.data);
    } else if (!result.available) {
      setStorageMessage(
        '이 브라우저에서는 진도를 저장할 수 없어 현재 탭에서만 유지합니다.',
      );
    }
    setHydrated(true);
  }, []);
  /* oxlint-enable react/react-compiler */

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!hydrated || !document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const context = document.modelContext;
    const reportError = () => undefined;

    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'open_white_lab_lesson',
            title: '화이트랩 수업 열기',
            description:
              '잠금 해제된 화이트랩 수업을 화면에 엽니다. 완료 처리나 정답 제출은 하지 않습니다.',
            inputSchema: {
              type: 'object',
              properties: { lessonId: { type: 'string', enum: lessonIds } },
              required: ['lessonId'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              const lessonId =
                input && typeof input === 'object' && 'lessonId' in input
                  ? (input as { lessonId: unknown }).lessonId
                  : undefined;
              if (typeof lessonId !== 'string')
                throw new Error('lessonId가 필요합니다.');
              const index = lessonIds.indexOf(lessonId);
              if (index === -1) throw new Error('존재하지 않는 수업입니다.');
              if (
                !isLessonUnlocked(
                  index,
                  lessonIds,
                  progressRef.current.completedLessonIds,
                )
              ) {
                throw new Error(
                  '아직 잠긴 수업입니다. 앞 수업을 먼저 완료하세요.',
                );
              }
              setSelectedId(lessonId);
              return { lessonId, status: 'opened' };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(reportError);
    } catch {
      reportError();
    }
    return () => lifecycle.abort();
  }, [hydrated]);

  const completedCount = progress.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  function handleComplete(lessonId: string) {
    setProgress((current) => {
      const next = completeLesson(current, lessonId);
      if (next === current) return current;
      const saved = createBrowserProgressStore().write(next);
      if (!saved)
        setStorageMessage(
          '완료 상태는 반영했지만 브라우저 저장소에는 기록하지 못했습니다.',
        );
      return next;
    });
  }

  function handleFullReset() {
    const next = createDefaultProgress();
    createBrowserProgressStore().reset();
    setProgress(next);
    setSelectedId(lessons[0].id);
    setStorageMessage('전체 진도를 초기화했습니다.');
    setResetDialogOpen(false);
  }

  function openLesson(lesson: Lesson) {
    const index = lessons.findIndex((candidate) => candidate.id === lesson.id);
    if (!isLessonUnlocked(index, lessonIds, progress.completedLessonIds))
      return;
    setSelectedId(lesson.id);
    setNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main
      className="min-h-screen bg-slate-50 text-slate-950"
      data-training-scope="this-app-only"
    >
      <a
        className="sr-only z-50 rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#lesson-content"
      >
        학습 내용으로 건너뛰기
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-700 text-white shadow-sm">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight">화이트랩</p>
              <p className="hidden text-xs text-slate-500 sm:block">
                안전한 웹 보안 실습실
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden min-w-40 sm:block">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>전체 진도</span>
                <span>
                  {completedCount} / {lessons.length}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-cyan-600 transition-[width]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-semibold text-cyan-800">
              {progressPercent}% 완료
            </span>
            <Button
              aria-expanded={navigationOpen}
              aria-controls="course-navigation"
              className="lg:hidden"
              onClick={() => setNavigationOpen((open) => !open)}
              size="icon"
              variant="outline"
            >
              <Menu />
              <span className="sr-only">과정 지도 열기</span>
            </Button>
          </div>
        </div>
      </header>

      {storageMessage && (
        <output className="border-b border-blue-200 bg-blue-50 px-4 py-2 text-center text-xs text-blue-900">
          <Database className="mr-1 inline size-3.5" />
          {storageMessage}
          <button
            className="ml-2 underline underline-offset-2"
            onClick={() => setStorageMessage(null)}
            type="button"
          >
            닫기
          </button>
        </output>
      )}

      <div className="mx-auto grid max-w-[1480px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <aside
          className={`${navigationOpen ? 'block' : 'hidden'} h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
          id="course-navigation"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
                과정 지도
              </p>
              <h2 className="mt-1 font-bold">기초 → 중급 → CTF</h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {progressPercent}%
            </span>
          </div>
          <nav aria-label="학습 과정">
            {courseSections.map((section) => {
              const sectionLessons = lessons.filter(
                (lesson) => lesson.level === section.id,
              );
              return (
                <section className="mb-5" key={section.id}>
                  <div className="mb-2 px-2">
                    <h3 className="text-xs font-bold text-slate-800">
                      {section.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {section.description}
                    </p>
                  </div>
                  <ol className="space-y-1">
                    {sectionLessons.map((lesson) => {
                      const index = lessons.findIndex(
                        (candidate) => candidate.id === lesson.id,
                      );
                      const unlocked = isLessonUnlocked(
                        index,
                        lessonIds,
                        progress.completedLessonIds,
                      );
                      const completed = progress.completedLessonIds.includes(
                        lesson.id,
                      );
                      const current = lesson.id === selectedId;
                      return (
                        <li key={lesson.id}>
                          <button
                            aria-current={current ? 'step' : undefined}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${current ? 'bg-cyan-50 font-semibold text-cyan-950' : unlocked ? 'text-slate-700 hover:bg-slate-50' : 'cursor-not-allowed text-slate-400'}`}
                            disabled={!unlocked}
                            onClick={() => openLesson(lesson)}
                            type="button"
                          >
                            <span
                              className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs ${completed ? 'border-cyan-600 bg-cyan-600 text-white' : current ? 'border-cyan-600 text-cyan-700' : 'border-slate-200'}`}
                            >
                              {completed ? (
                                <Check className="size-3.5" />
                              ) : unlocked ? (
                                index + 1
                              ) : (
                                <LockKeyhole className="size-3" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1 leading-5">
                              {lesson.title}
                              <span className="sr-only">
                                {completed
                                  ? ' 완료됨'
                                  : unlocked
                                    ? ' 잠금 해제됨'
                                    : ' 잠김'}
                              </span>
                            </span>
                            {current && (
                              <ChevronRight
                                aria-hidden="true"
                                className="size-4 shrink-0"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </nav>

          <details className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer text-xs font-bold text-slate-700">
              심화 과정 로드맵 · 준비 중
            </summary>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-500">
              {advancedRoadmap.map((item) => (
                <li className="flex gap-2" key={item}>
                  <LockKeyhole className="mt-0.5 size-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </details>

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger
              render={<Button className="mt-4 w-full" variant="outline" />}
            >
              <RotateCcw />
              전체 진도 초기화
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>전체 진도를 초기화할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  완료한 수업과 잠금 해제 기록이 이 기기에서 삭제됩니다. 이
                  작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-700 text-white hover:bg-red-800"
                  onClick={handleFullReset}
                >
                  모두 초기화
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </aside>

        <div id="lesson-content">
          {!hydrated ? (
            <output className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              저장된 진도를 불러오는 중입니다…
            </output>
          ) : (
            <LessonView
              completed={progress.completedLessonIds.includes(
                selectedLesson.id,
              )}
              key={selectedLesson.id}
              lesson={selectedLesson}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs leading-5 text-slate-500">
        화이트랩의 모든 실습은 고정된 교육용 데이터만 사용합니다. 본인
        소유이거나 명시적으로 허가받은 시스템에서만 보안 기술을 사용하세요.
      </footer>
    </main>
  );
}
