import assert from 'node:assert/strict';
import test from 'node:test';

import { createAssessmentApi } from './api.js';

test('createAssessmentApi creates a new assessment session', async () => {
  const calls = [];
  const api = createAssessmentApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            assessmentId: 101,
            status: 'in_progress',
            currentQuestionId: 'B01',
            currentIndex: 0,
            totalQuestions: 3,
          },
        },
      };
    },
  });

  const response = await api.createAssessment();

  assert.deepEqual(calls, [
    {
      url: '/assessment/create',
      method: 'POST',
      data: {},
    },
  ]);
  assert.deepEqual(response, {
    assessmentId: 101,
    status: 'in_progress',
    currentQuestionId: 'B01',
    currentIndex: 0,
    totalQuestions: 3,
  });
});

test('createAssessmentApi submits an answer and returns the next question pointer', async () => {
  const calls = [];
  const api = createAssessmentApi({
    request: async (payload) => {
      calls.push(payload);
      return {
        data: {
          code: 200,
          data: {
            assessmentId: 101,
            status: 'in_progress',
            currentQuestionId: 'B02',
            currentIndex: 1,
            totalQuestions: 3,
          },
        },
      };
    },
  });

  const response = await api.submitAnswer(101, {
    questionId: 'B01',
    value: 'female',
  });

  assert.deepEqual(calls, [
    {
      url: '/assessment/101/answer',
      method: 'POST',
      data: {
        questionId: 'B01',
        value: 'female',
      },
    },
  ]);
  assert.deepEqual(response, {
    assessmentId: 101,
    status: 'in_progress',
    currentQuestionId: 'B02',
    currentIndex: 1,
    totalQuestions: 3,
  });
});

test('createAssessmentApi resumes the latest unfinished assessment session', async () => {
  const api = createAssessmentApi({
    request: async () => ({
      data: {
        code: 200,
        data: {
          assessmentId: 101,
          status: 'in_progress',
          currentQuestionId: 'B02',
          currentIndex: 1,
          totalQuestions: 3,
        },
      },
    }),
  });

  const response = await api.resumeAssessment();

  assert.deepEqual(response, {
    assessmentId: 101,
    status: 'in_progress',
    currentQuestionId: 'B02',
    currentIndex: 1,
    totalQuestions: 3,
  });
});
