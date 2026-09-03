export const PROGRESS_KEY = 'white-lab-progress-v1';
export const PROGRESS_VERSION = 1;

export interface ProgressData {
  version: typeof PROGRESS_VERSION;
  completedLessonIds: string[];
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ProgressReadResult {
  data: ProgressData;
  recovered: boolean;
  available: boolean;
}

export interface ProgressStore {
  read(): ProgressReadResult;
  write(data: ProgressData): boolean;
  reset(): boolean;
}

export function createDefaultProgress(now = new Date()): ProgressData {
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: [],
    updatedAt: now.toISOString(),
  };
}

function isProgressData(value: unknown): value is ProgressData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.version === PROGRESS_VERSION &&
    Array.isArray(candidate.completedLessonIds) &&
    candidate.completedLessonIds.every((id) => typeof id === 'string') &&
    typeof candidate.updatedAt === 'string'
  );
}

export function readProgress(
  storage: StorageLike | undefined,
  now = new Date(),
): ProgressReadResult {
  if (!storage) {
    return {
      data: createDefaultProgress(now),
      recovered: false,
      available: false,
    };
  }

  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (raw === null) {
      return {
        data: createDefaultProgress(now),
        recovered: false,
        available: true,
      };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isProgressData(parsed)) {
      return {
        data: createDefaultProgress(now),
        recovered: true,
        available: true,
      };
    }
    return {
      data: {
        ...parsed,
        completedLessonIds: [...new Set(parsed.completedLessonIds)],
      },
      recovered: false,
      available: true,
    };
  } catch {
    return {
      data: createDefaultProgress(now),
      recovered: true,
      available: false,
    };
  }
}

export function writeProgress(
  storage: StorageLike | undefined,
  data: ProgressData,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function resetStoredProgress(storage: StorageLike | undefined): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(PROGRESS_KEY);
    return true;
  } catch {
    return false;
  }
}

export function completeLesson(
  progress: ProgressData,
  lessonId: string,
  now = new Date(),
): ProgressData {
  if (progress.completedLessonIds.includes(lessonId)) return progress;
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    updatedAt: now.toISOString(),
  };
}

export function isLessonUnlocked(
  lessonIndex: number,
  lessonIds: string[],
  completedLessonIds: string[],
): boolean {
  if (lessonIndex <= 0) return true;
  return completedLessonIds.includes(lessonIds[lessonIndex - 1]);
}

export function getCurrentLessonId(
  lessonIds: string[],
  completedLessonIds: string[],
): string {
  const firstIncomplete = lessonIds.findIndex(
    (id, index) =>
      !completedLessonIds.includes(id) &&
      isLessonUnlocked(index, lessonIds, completedLessonIds),
  );
  return lessonIds[
    firstIncomplete === -1 ? lessonIds.length - 1 : firstIncomplete
  ];
}

export function createBrowserProgressStore(): ProgressStore {
  let storage: StorageLike | undefined;
  try {
    storage = typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    storage = undefined;
  }
  return {
    read: () => readProgress(storage),
    write: (data) => writeProgress(storage, data),
    reset: () => resetStoredProgress(storage),
  };
}
