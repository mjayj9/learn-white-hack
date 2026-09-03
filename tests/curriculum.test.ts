import assert from 'node:assert/strict';
import test from 'node:test';
import { lessons } from '../lib/curriculum.ts';

void test('기초 8개, 중급 2개, CTF 1개를 제공한다', () => {
  assert.equal(
    lessons.filter((lesson) => lesson.level === 'foundation').length,
    8,
  );
  assert.equal(
    lessons.filter((lesson) => lesson.level === 'intermediate').length,
    2,
  );
  assert.equal(lessons.filter((lesson) => lesson.level === 'ctf').length, 1);
});

void test('모든 수업에 목표·힌트·해설·방어 방법이 있다', () => {
  for (const lesson of lessons) {
    assert.ok(lesson.goal.length > 0, lesson.id);
    assert.ok(lesson.theory.length >= 3, lesson.id);
    assert.ok(lesson.hints.length >= 2, lesson.id);
    assert.ok(lesson.acceptedAnswers.length >= 1, lesson.id);
    assert.ok(lesson.explanation.length > 0, lesson.id);
    assert.ok(lesson.defense.length > 0, lesson.id);
  }
});
