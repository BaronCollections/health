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

test('createAssessmentApi uploads an OCR file through the mini program upload adapter', async () => {
  const calls = [];
  const api = createAssessmentApi({
    env: {
      apiBaseUrl: 'https://mintbit.test/api',
      requestTimeout: 8000,
      appVersion: 'test-build',
    },
    session: {
      accessToken: 'token-123',
    },
    locale: 'en',
    appId: 'wx-test',
    uploadFile: async (payload) => {
      calls.push(payload);
      return {
        data: JSON.stringify({
          code: 200,
          data: {
            assessmentId: 101,
            taskId: 'ocr-task-101',
            status: 'uploaded',
            nextAction: 'review_result',
            fileName: 'report.pdf',
            fileSize: 4096,
            fileType: 'application/pdf',
            uploadedAt: '2026-03-17T01:00:00Z',
          },
        }),
      };
    },
    request: async () => {
      throw new Error('request should not be used for upload');
    },
  });

  const response = await api.uploadOcrReport(101, {
    filePath: '/tmp/report.pdf',
    name: 'report.pdf',
    mimeType: 'application/pdf',
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://mintbit.test/api/assessment/101/report/upload');
  assert.equal(calls[0].filePath, '/tmp/report.pdf');
  assert.equal(calls[0].name, 'file');
  assert.equal(calls[0].timeout, 8000);
  assert.equal(calls[0].header.Authorization, 'Bearer token-123');
  assert.equal(calls[0].header['Accept-Language'], 'en');
  assert.equal(calls[0].header['X-Wechat-AppId'], 'wx-test');
  assert.deepEqual(calls[0].formData, {
    fileName: 'report.pdf',
    fileType: 'application/pdf',
  });
  assert.deepEqual(response, {
    assessmentId: 101,
    taskId: 'ocr-task-101',
    status: 'uploaded',
    nextAction: 'review_result',
    fileName: 'report.pdf',
    fileSize: 4096,
    fileType: 'application/pdf',
    uploadedAt: '2026-03-17T01:00:00Z',
  });
});

test('createAssessmentApi fetches the OCR result payload for confirmation', async () => {
  const api = createAssessmentApi({
    request: async (payload) => {
      assert.deepEqual(payload, {
        url: '/assessment/101/report/result',
        method: 'GET',
      });

      return {
        data: {
          code: 200,
          data: {
            assessmentId: 101,
            taskId: 'ocr-task-101',
            status: 'needs_confirmation',
            confirmationRequired: true,
            sourceSummary: 'mock-ocr-contract',
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
        },
      };
    },
  });

  const response = await api.getOcrResult(101);

  assert.deepEqual(response, {
    assessmentId: 101,
    taskId: 'ocr-task-101',
    status: 'needs_confirmation',
    confirmationRequired: true,
    sourceSummary: 'mock-ocr-contract',
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
});
