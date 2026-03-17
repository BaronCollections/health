import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentQuestionBank, getNextVisibleQuestion } from './question-bank.js';

test('getAssessmentQuestionBank returns the full bilingual Phase 1 questionnaire bank', () => {
  const zhBank = getAssessmentQuestionBank('zh-CN');
  const enBank = getAssessmentQuestionBank('en');

  assert.equal(zhBank.length, 30);
  assert.equal(enBank.length, 30);
  assert.equal(zhBank[0].title, '你的性别是？');
  assert.equal(enBank[0].title, 'What is your gender?');
  assert.equal(enBank[2].fields[0].label, 'Height (cm)');
  assert.equal(enBank[29].title, 'What are your core health goals?');
});

test('getNextVisibleQuestion skips hidden questions and supports multi-choice entries', () => {
  const nextQuestion = getNextVisibleQuestion({
    locale: 'en',
    startIndex: 4,
    answers: {
      B01: 'male',
      B02: 'age_18_35',
      B03: {
        heightCm: '180',
        weightKg: '80',
      },
      B04: 'north',
    },
  });

  assert.equal(nextQuestion.id, 'L01');

  const goalQuestion = getAssessmentQuestionBank('en').find((question) => question.id === 'G01');
  assert.equal(goalQuestion.type, 'multi_choice');
  assert.equal(goalQuestion.options[0].label, 'Better sleep');
});
