import assert from 'node:assert/strict';
import test from 'node:test';

import { createAssessmentSessionStore } from './session.js';

function createMemoryStorage(seed = {}) {
  const state = new Map(Object.entries(seed));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    },
  };
}

test('createAssessmentSessionStore persists assessment progress and answers', () => {
  const store = createAssessmentSessionStore({
    storage: createMemoryStorage(),
  });

  store.save({
    assessmentId: 101,
    currentQuestionId: 'B02',
    currentIndex: 1,
    totalQuestions: 3,
    answers: {
      B01: 'female',
    },
  });

  assert.deepEqual(store.read(), {
    assessmentId: 101,
    currentQuestionId: 'B02',
    currentIndex: 1,
    totalQuestions: 3,
    answers: {
      B01: 'female',
    },
  });
});

test('createAssessmentSessionStore clears the active assessment session', () => {
  const store = createAssessmentSessionStore({
    storage: createMemoryStorage({
      'mintbit.assessment.session': JSON.stringify({
        assessmentId: 101,
        currentQuestionId: 'B02',
        currentIndex: 1,
        totalQuestions: 3,
        answers: {
          B01: 'female',
        },
      }),
    }),
  });

  store.clear();

  assert.equal(store.read(), null);
});

test('createAssessmentSessionStore persists OCR upload metadata and OCR confirmation payload', () => {
  const store = createAssessmentSessionStore({
    storage: createMemoryStorage({
      'mintbit.assessment.session': JSON.stringify({
        assessmentId: 101,
        status: 'completed',
      }),
    }),
  });

  store.saveOcrUpload({
    fileName: 'report.pdf',
    filePath: '/tmp/report.pdf',
    fileSize: 4096,
    fileType: 'application/pdf',
    uploadedAt: '2026-03-17T01:00:00Z',
    syncStatus: 'uploaded',
    taskId: 'ocr-task-101',
  });
  store.saveOcrResult({
    assessmentId: 101,
    status: 'needs_confirmation',
    sections: [
      {
        id: 'baseline',
        fields: [
          {
            id: 'vitamin-d',
            value: '18 ng/mL',
            confidence: 'medium',
          },
        ],
      },
    ],
  });

  assert.deepEqual(store.read(), {
    assessmentId: 101,
    status: 'completed',
    ocrUpload: {
      fileName: 'report.pdf',
      filePath: '/tmp/report.pdf',
      fileSize: 4096,
      fileType: 'application/pdf',
      uploadedAt: '2026-03-17T01:00:00Z',
      syncStatus: 'uploaded',
      taskId: 'ocr-task-101',
    },
    ocrResult: {
      assessmentId: 101,
      status: 'needs_confirmation',
      sections: [
        {
          id: 'baseline',
          fields: [
            {
              id: 'vitamin-d',
              value: '18 ng/mL',
              confidence: 'medium',
            },
          ],
        },
      ],
    },
  });
});
