import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PROGRESS_KEY,
  completeLesson,
  createDefaultProgress,
  getCurrentLessonId,
  isLessonUnlocked,
  readProgress,
  resetStoredProgress,
  writeProgress,
  type StorageLike,
} from '../lib/progress.ts';

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  fail = false;

  getItem(key: string) {
    if (this.fail) throw new Error('blocked');
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.fail) throw new Error('blocked');
    this.values.set(key, value);
  }
  removeItem(key: string) {
    if (this.fail) throw new Error('blocked');
    this.values.delete(key);
  }
}

const now = new Date('2026-09-03T00:00:00.000Z');

void test('진도를 저장하고 복원한다', () => {
  const storage = new MemoryStorage();
  const completed = completeLesson(createDefaultProgress(now), 'lesson-1', now);
  assert.equal(writeProgress(storage, completed), true);
  assert.deepEqual(readProgress(storage, now).data, completed);
});

void test('손상된 데이터는 안전한 초기값으로 복구한다', () => {
  const storage = new MemoryStorage();
  storage.values.set(PROGRESS_KEY, '{broken json');
  const result = readProgress(storage, now);
  assert.equal(result.recovered, true);
  assert.deepEqual(result.data.completedLessonIds, []);
});

void test('저장소 접근 실패가 앱 상태를 깨뜨리지 않는다', () => {
  const storage = new MemoryStorage();
  storage.fail = true;
  const result = readProgress(storage, now);
  assert.equal(result.available, false);
  assert.equal(writeProgress(storage, result.data), false);
  assert.equal(resetStoredProgress(storage), false);
});

void test('완료 시 다음 수업만 잠금 해제하고 전체 초기화할 수 있다', () => {
  const ids = ['one', 'two', 'three'];
  const progress = completeLesson(createDefaultProgress(now), 'one', now);
  assert.equal(isLessonUnlocked(1, ids, progress.completedLessonIds), true);
  assert.equal(isLessonUnlocked(2, ids, progress.completedLessonIds), false);
  assert.equal(getCurrentLessonId(ids, progress.completedLessonIds), 'two');
  const storage = new MemoryStorage();
  writeProgress(storage, progress);
  assert.equal(resetStoredProgress(storage), true);
  assert.equal(storage.getItem(PROGRESS_KEY), null);
});
