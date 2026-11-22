(() => {
"use strict";
function render(main, config) {
const data=window.TRIP_DATA?.quiz || {};
const raw=data.categories || {};
const QUIZZES=Object.create(null);
for(const [key,q] of Object.entries(raw)){
  if(!/^[A-Za-z0-9_-]+$/.test(key)||!q||typeof q.categoryName!=="string"||!Array.isArray(q.questions))continue;
  const questions=q.questions.filter(x=>x&&typeof x.question==="string"&&Array.isArray(x.choices)&&x.choices.length>=2&&x.choices.every(c=>typeof c==="string")&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<x.choices.length);
  if(questions.length) QUIZZES[key]={...q,questions,perfectTitle:q.perfectTitle||"おめでとう！",passMessage:q.passMessage||"予習はバッチリ！"};
}
const parsed=Date.parse(data.openAt||"");
const QUIZ_OPEN_AT=Number.isFinite(parsed)?parsed:0;
const openLabel=Number.isFinite(parsed)?String(data.openAt).slice(0,10).replaceAll("-","."):"";
const STORAGE_PREFIX="travel-template:quiz:"+location.pathname+":"+String(config.id||"trip")+":"+String(config.startDate||"")+":";
const quizApp=document.createElement("div");quizApp.id="quiz-app";main.append(quizApp);
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);}


const state = {
    currentKey: null,
    selections: [],
    submitted: false
};

function getBestScore(key) {
    try {
        const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);

        if (value === null) {
            return null;
        }

        const score = Number(value);

        return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
    } catch (error) {
        return null;
    }
}

function saveBestScore(key, score) {
    const currentBest = getBestScore(key);

    const nextBest =
        currentBest === null
            ? score
            : Math.max(currentBest, score);

    try {
        localStorage.setItem(
            `${STORAGE_PREFIX}${key}`,
            String(nextBest)
        );
    } catch (error) {
        // localStorageが利用できない環境でも
        // クイズ自体はそのまま遊べるようにします。
    }

    return nextBest;
}

function getScoreStatus(bestScore) {
    if (bestScore === null) {
        return `
      <span class="quiz-card-status">
        未挑戦
      </span>
    `;
    }

    if (bestScore === 100) {
        return `
      <span class="quiz-card-status is-perfect">
        ★ PERFECT
      </span>
      <span class="quiz-best-score">
        最高得点 ${bestScore} / 100
      </span>
    `;
    }

    if (bestScore >= 80) {
        return `
      <span class="quiz-card-status is-passed">
        ✓ 合格
      </span>
      <span class="quiz-best-score">
        最高得点 ${bestScore} / 100
      </span>
    `;
    }

    return `
    <span class="quiz-card-status">
      挑戦済み
    </span>
    <span class="quiz-best-score">
      最高得点 ${bestScore} / 100
    </span>
  `;
}

function renderLockScreen() {
    quizApp.innerHTML = `
    <section
      class="quiz-lock"
      aria-labelledby="quiz-lock-title"
    >
      <div
        class="quiz-lock-icon"
        aria-hidden="true"
      >
        🔒
      </div>

      <span class="eyebrow">
        SIGHTSEEING QUIZ
      </span>

      <h1
        class="section-title"
        id="quiz-lock-title"
      >
        観光地クイズ
      </h1>

      <p class="quiz-lock-message">
        公開日時になると解放されます
      </p>

      <p class="quiz-open-date">
        ${escapeHtml(openLabel)} OPEN
      </p>

    </section>
  `;
}

function renderQuizList() {
    state.currentKey = null;
    state.selections = [];
    state.submitted = false;

    if (!Object.keys(QUIZZES).length) { quizApp.innerHTML = '<h1 class="page-title">観光地クイズ</h1><p class="notice">クイズはまだ登録されていません。</p>'; return; }
    const scores = Object.keys(QUIZZES).map(
        (key) => getBestScore(key)
    );

    const allPassed = scores.every(
        (score) => score !== null && score >= 80
    );

    const allPerfect = scores.every(
        (score) => score === 100
    );

    let achievement = '';

    if (allPerfect) {
        achievement = `
      <div
        class="quiz-achievement is-perfect"
        role="status"
      >
        <strong>ALL PERFECT！</strong>
        <span>
          ${scores.length}つの観光地クイズ、すべて100点！
        </span>
      </div>
    `;
    } else if (allPassed) {
        achievement = `
      <div
        class="quiz-achievement"
        role="status"
      >
        <strong>全クイズ制覇！</strong>
        <span>
          ${scores.length}つすべてで80点以上を達成しました。
        </span>
      </div>
    `;
    }

    const cards = Object.entries(QUIZZES)
        .map(([key, quiz]) => {
            const bestScore = getBestScore(key);

            return `
        <article class="quiz-select-card">

          <div class="quiz-select-card-head">
            <h2>
              ${escapeHtml(quiz.categoryName)}
            </h2>

            <span>
              全${quiz.questions.length}問 / 100点満点
            </span>
          </div>

          <div
            class="quiz-select-card-record"
            aria-label="挑戦記録"
          >
            ${getScoreStatus(bestScore)}
          </div>

          <button
            class="btn quiz-start-button"
            type="button"
            data-action="start"
            data-quiz-key="${key}"
          >
            挑戦する
          </button>

        </article>
      `;
        })
        .join('');

    quizApp.innerHTML = `
    <section
      class="quiz-top"
      aria-labelledby="quiz-list-title"
    >

      <div class="page-hero quiz-page-hero">

        <span class="eyebrow">
          SIGHTSEEING QUIZ
        </span>

        <h1
          class="page-title"
          id="quiz-list-title"
        >
          観光地クイズ
        </h1>

        <p class="page-lead">
          旅先のことをどれくらい知ってる？<br>
          気になるクイズに挑戦しよう！
        </p>

      </div>

      ${achievement}

      <div class="quiz-select-grid">
        ${cards}
      </div>

    </section>
  `;
}

function startQuiz(key) {
    if (!Object.hasOwn(QUIZZES,key) || Date.now() < QUIZ_OPEN_AT) {
        return;
    }

    state.currentKey = key;

    state.selections = Array(
        QUIZZES[key].questions.length
    ).fill(null);

    state.submitted = false;

    renderQuizScreen();
    scrollQuizToTop();
}

function renderQuizScreen() {
    const quiz = QUIZZES[state.currentKey];

    if (!quiz) {
        return;
    }

    const questionsHtml = quiz.questions
        .map((item, questionIndex) => {
            const choicesHtml = item.choices
                .map((choice, choiceIndex) => `
          <button
            class="quiz-choice"
            type="button"
            data-action="choice"
            data-question-index="${questionIndex}"
            data-choice-index="${choiceIndex}"
            aria-pressed="false"
          >
            <span
              class="quiz-choice-mark"
              aria-hidden="true"
            ></span>

            <span>${escapeHtml(choice)}</span>
          </button>
        `)
                .join('');

            return `
        <article
          class="quiz-question-card"
          data-question-card="${questionIndex}"
        >

          <div class="quiz-question-number">
            Q${questionIndex + 1}
          </div>

          <h2 class="quiz-question-text">
            ${escapeHtml(item.question)}
          </h2>

          <div
            class="quiz-choices"
            aria-label="Q${questionIndex + 1} の選択肢"
          >
            ${choicesHtml}
          </div>

        </article>
      `;
        })
        .join('');

    quizApp.innerHTML = `
    <section
      class="quiz-playing"
      aria-labelledby="quiz-current-title"
    >

      <div class="quiz-playing-head">

        <span class="eyebrow">
          ${quiz.questions.length} QUESTIONS
        </span>

        <h1
          class="section-title"
          id="quiz-current-title"
        >
          ${escapeHtml(quiz.categoryName)}
        </h1>

        <p>
          全${quiz.questions.length}問で100点満点。
        </p>

      </div>

      <div class="quiz-question-list">
        ${questionsHtml}
      </div>

      <div class="quiz-submit-wrap">

        <p
          class="quiz-answer-progress"
          id="quiz-answer-progress"
          aria-live="polite"
        >
          0 / ${quiz.questions.length} 問回答済み
        </p>

        <button
          class="btn quiz-submit-button"
          id="quiz-submit-button"
          type="button"
          data-action="submit"
          disabled
        >
          回答する
        </button>

      </div>

    </section>
  `;
}

function selectChoice(
    questionIndex,
    choiceIndex
) {
    if (
        state.submitted ||
        !QUIZZES[state.currentKey]
    ) {
        return;
    }

    if (!Number.isInteger(questionIndex) || !Number.isInteger(choiceIndex) || !QUIZZES[state.currentKey].questions[questionIndex] || choiceIndex < 0 || choiceIndex >= QUIZZES[state.currentKey].questions[questionIndex].choices.length) return;
    state.selections[questionIndex] =
        choiceIndex;

    const card = quizApp.querySelector(
        `[data-question-card="${questionIndex}"]`
    );

    if (card) {
        card
            .querySelectorAll('.quiz-choice')
            .forEach((button) => {
                const isSelected =
                    Number(button.dataset.choiceIndex) ===
                    choiceIndex;

                button.classList.toggle(
                    'is-selected',
                    isSelected
                );

                button.setAttribute(
                    'aria-pressed',
                    String(isSelected)
                );
            });
    }

    updateAnswerProgress();
}

function updateAnswerProgress() {
    const answeredCount =
        state.selections.filter(
            (value) => value !== null
        ).length;

    const total =
        state.selections.length;

    const progress =
        quizApp.querySelector(
            '#quiz-answer-progress'
        );

    const submitButton =
        quizApp.querySelector(
            '#quiz-submit-button'
        );

    if (progress) {
        progress.textContent =
            `${answeredCount} / ${total} 問回答済み`;
    }

    if (submitButton) {
        submitButton.disabled =
            answeredCount !== total;
    }
}

function submitQuiz() {
    const quiz =
        QUIZZES[state.currentKey];

    if (
        !quiz ||
        state.submitted
    ) {
        return;
    }

    if (
        state.selections.some(
            (value) => value === null
        )
    ) {
        return;
    }

    state.submitted = true;

    const correctCount =
        quiz.questions.reduce(
            (count, question, index) => {
                return count + (
                    state.selections[index] ===
                        question.answer
                        ? 1
                        : 0
                );
            },
            0
        );

    const score =
        correctCount === quiz.questions.length ? 100 : Math.min(99, Math.floor(correctCount * 100 / quiz.questions.length));

    saveBestScore(
        state.currentKey,
        score
    );

    renderResult(score);
    scrollQuizToTop();
}

function getResultMessage(
    score,
    quiz
) {
    if (score === 100) {
        return {
            title: 'PERFECT！',
            message: quiz.perfectTitle,
            className: 'is-perfect'
        };
    }

    if (score >= 80) {
        return {
            title: '合格！',
            message: quiz.passMessage,
            className: 'is-passed'
        };
    }

    return {
        title: 'もう少しで合格！',
        message:
            '観光しながら答え合わせしてみよう',
        className: ''
    };
}

function renderResult(score) {
    const quiz =
        QUIZZES[state.currentKey];

    const detailUrl = config.features?.sightseeing === true && /^sightseeing\.html(?:#[A-Za-z][A-Za-z0-9_-]*)?$/.test(quiz.detailUrl || "") ? quiz.detailUrl : "";

    const resultMessage =
        getResultMessage(
            score,
            quiz
        );

    const scoreCat =
        score === 100
            ? `
    <div
          class="quiz-perfect-celebration"
          aria-label="100点のお祝い"
        >
          <img
            src="images/quiz/cat-100.png"
            alt="100点をお祝いする猫"
            class="quiz-perfect-cat"
          >
        </div>
      `
            : score >= 80
                ? `
        <div
          class="quiz-perfect-celebration"
          aria-label="合格した猫"
        >
          <img
            src="images/quiz/cat-80.png"
            alt="合格したときの猫"
            class="quiz-perfect-cat"
          >
        </div>
      `
                : score < 80
                    ? `
        <div
          class="quiz-perfect-celebration"
          aria-label="もう少しで合格の猫"
        >
          <img
            src="images/quiz/cat-0.png"
            alt="もう少しで合格の猫"
            class="quiz-perfect-cat"
          >
        </div>
  `
                    : '';

    const questionsHtml =
        quiz.questions
            .map((item, questionIndex) => {
                const selectedIndex =
                    state.selections[questionIndex];

                const isCorrect =
                    selectedIndex === item.answer;

                const choicesHtml =
                    item.choices
                        .map(
                            (
                                choice,
                                choiceIndex
                            ) => {
                                const classes = [
                                    'quiz-choice'
                                ];

                                let suffix = '';

                                if (
                                    choiceIndex ===
                                    item.answer
                                ) {
                                    classes.push(
                                        'is-correct-answer'
                                    );

                                    suffix = `
                    <span
                      class="quiz-choice-result-label"
                    >
                      正解
                    </span>
                  `;
                                }

                                if (
                                    choiceIndex ===
                                    selectedIndex &&
                                    !isCorrect
                                ) {
                                    classes.push(
                                        'is-wrong-answer'
                                    );

                                    suffix = `
                    <span
                      class="quiz-choice-result-label"
                    >
                      あなたの回答
                    </span>
                  `;
                                }

                                if (
                                    choiceIndex ===
                                    selectedIndex
                                ) {
                                    classes.push(
                                        'is-selected'
                                    );
                                }

                                return `
                  <button
                    class="${classes.join(' ')}"
                    type="button"
                    disabled
                    aria-pressed="${choiceIndex ===
                                    selectedIndex
                                    }"
                  >

                    <span
                      class="quiz-choice-mark"
                      aria-hidden="true"
                    ></span>

                    <span>
                      ${escapeHtml(choice)}
                    </span>

                    ${suffix}

                  </button>
                `;
                            }
                        )
                        .join('');

                return `
          <article
            class="
              quiz-question-card
              quiz-result-question
              ${isCorrect
                        ? 'is-correct'
                        : 'is-wrong'
                    }
            "
          >

            <div class="quiz-question-number">
              Q${questionIndex + 1}
            </div>

            <h2 class="quiz-question-text">
              ${escapeHtml(item.question)}
            </h2>

            <div
              class="quiz-choices"
              aria-label="Q${questionIndex + 1} の採点結果"
            >
              ${choicesHtml}
            </div>

            <div class="quiz-explanation">

              <strong class="quiz-judge">
                ${isCorrect
                        ? '✓ 正解'
                        : '× 不正解'
                    }
              </strong>

              <p>
                <b>正しい選択肢：</b>
                ${escapeHtml(item.choices[item.answer])}
              </p>

              <p>
                ${escapeHtml(item.explanation)}
              </p>

            </div>

          </article>
        `;
            })
            .join('');

    quizApp.innerHTML = `
    <section
      class="quiz-result"
      aria-labelledby="quiz-result-title"
    >

      <div
        class="
          quiz-score-card
          ${resultMessage.className}
        "
        role="status"
        aria-live="polite"
      >

        <span class="eyebrow">
          RESULT
        </span>

        <div class="quiz-score">
          ${score}
          <span>/ 100</span>
        </div>

        <h1 id="quiz-result-title">
          ${resultMessage.title}
        </h1>

        <p>
          ${escapeHtml(resultMessage.message)}
        </p>

      </div>

      ${scoreCat}

      <div class="quiz-question-list">
        ${questionsHtml}
      </div>

      <div class="quiz-result-actions">

        <button
          class="btn"
          type="button"
          data-action="retry"
        >
          もう一度挑戦する
        </button>

        ${detailUrl ? `<a class="btn secondary quiz-detail-link" href="${escapeHtml(detailUrl)}">観光地の詳細を見る</a>` : ""}

        <button
          class="btn secondary"
          type="button"
          data-action="back"
        >
          クイズ一覧に戻る
        </button>

      </div>

    </section>
  `;
    if (score === 100) {
        playPerfectSound();
    } else if (score < 80) {
        playFailureSound();
    }

}

function playPerfectSound() {
    const audio =
        new Audio(
            'sounds/quiz-perfect.mp3'
        );

    audio.volume = 1.0;

    audio.play().catch(() => {
        // ブラウザ側で自動再生が制限された場合は
        // 音を鳴らさず、そのまま結果を表示します。
    });
}

function playFailureSound() {
    const audio =
        new Audio(
            'sounds/quiz-failure.mp3'
        );

    audio.volume = 1.0;

    audio.play().catch(() => {
        // ブラウザ側で自動再生が制限された場合は
        // 音を鳴らさず、そのまま結果を表示します。
    });
}

function retryQuiz() {
    if (!state.currentKey) {
        return;
    }

    state.selections = Array(
        QUIZZES[
            state.currentKey
        ].questions.length
    ).fill(null);

    state.submitted = false;

    renderQuizScreen();
    scrollQuizToTop();
}

function scrollQuizToTop() {
    const reduceMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    window.scrollTo({
        top: 0,
        behavior:
            reduceMotion
                ? 'auto'
                : 'smooth'
    });
}

function handleQuizClick(event) {
    const target =
        event.target.closest(
            '[data-action]'
        );

    if (!target) {
        return;
    }

    const action =
        target.dataset.action;

    if (action === 'start') {
        startQuiz(
            target.dataset.quizKey
        );
    } else if (
        action === 'choice'
    ) {
        selectChoice(
            Number(
                target.dataset.questionIndex
            ),
            Number(
                target.dataset.choiceIndex
            )
        );
    } else if (
        action === 'submit'
    ) {
        submitQuiz();
    } else if (
        action === 'retry'
    ) {
        retryQuiz();
    } else if (
        action === 'back'
    ) {
        renderQuizList();
        scrollQuizToTop();
    }
}

function initializeQuiz() {
    if (!quizApp) {
        return;
    }

    quizApp.addEventListener(
        'click',
        handleQuizClick
    );

    if (
        Date.now() >=
        QUIZ_OPEN_AT
    ) {
        renderQuizList();
        return;
    }

    renderLockScreen();

    const unlockTimer =
        window.setInterval(() => {
            if (
                Date.now() >=
                QUIZ_OPEN_AT
            ) {
                window.clearInterval(
                    unlockTimer
                );

                renderQuizList();
            }
        }, 30000);
}


initializeQuiz();
}
window.TravelPages=window.TravelPages||{};
window.TravelPages.quiz=render;
})();
