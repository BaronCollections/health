import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentQuestionBank } from './question-bank.js';

test('getAssessmentQuestionBank returns bilingual questionnaire content for the first assessment slice', () => {
  const zhBank = getAssessmentQuestionBank('zh-CN');
  const enBank = getAssessmentQuestionBank('en');

  assert.equal(zhBank.length, 3);
  assert.equal(enBank.length, 3);
  assert.equal(zhBank[0].title, '你的性别是？');
  assert.equal(enBank[0].title, 'What is your gender?');
  assert.equal(enBank[2].fields[0].label, 'Height (cm)');
});
