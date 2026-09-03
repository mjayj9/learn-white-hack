/*
 * 화이트랩 교육용 점수 추적 스크립트
 * 고정된 장난감 상태만 사용하며 외부 요청이나 비밀값은 없습니다.
 */
const scoreSession = {
  score: 0,
  gold: 12,
  lastAction: 'ready',
};

const scoreElement = document.querySelector('#score-value');
const goldElement = document.querySelector('#gold-value');
const statusElement = document.querySelector('#lab-status');
const solveButton = document.querySelector('#solve-button');
const resetButton = document.querySelector('#reset-score-button');

function updateScoreDom(nextScore) {
  scoreElement.textContent = String(nextScore);
  goldElement.textContent = String(scoreSession.gold);
}

function applyScoreIncrement(earnedPoint) {
  scoreSession.score += earnedPoint;
  scoreSession.lastAction = 'correct-answer';
  updateScoreDom(scoreSession.score);
}

function solveTrainingQuestion() {
  const earnedPoint = 1;
  applyScoreIncrement(earnedPoint);
  statusElement.textContent =
    '정답입니다. 점수 상태를 계산한 뒤 DOM에 반영했습니다.';
}

function resetTrainingScore() {
  scoreSession.score = 0;
  scoreSession.lastAction = 'reset';
  updateScoreDom(scoreSession.score);
  statusElement.textContent = '점수와 실습 상태를 초기화했습니다.';
}

solveButton.addEventListener('click', solveTrainingQuestion);
resetButton.addEventListener('click', resetTrainingScore);
updateScoreDom(scoreSession.score);
