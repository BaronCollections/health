import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReportViewModel } from './content.js';

test('buildReportViewModel returns a localized nutrition report summary with OCR confirmation state', () => {
  const viewModel = buildReportViewModel({
    locale: 'en',
    session: {
      assessmentId: 101,
      ocrUpload: {
        syncStatus: 'uploaded',
        fileName: 'report.pdf',
      },
      ocrResult: {
        status: 'confirmed',
        confirmedAt: '2026-03-17T02:00:00Z',
      },
    },
  });

  assert.equal(viewModel.header.posterTitle, 'Nutrition Snapshot');
  assert.equal(viewModel.metrics.totalScore, 49);
  assert.equal(viewModel.primaryGoal.label, 'Stress / Mood');
  assert.equal(viewModel.nutritionCards.length, 3);
  assert.equal(viewModel.ocrStatus.state, 'confirmed');
  assert.match(viewModel.ocrStatus.title, /OCR/i);
});

test('buildReportViewModel falls back to upload-pending OCR state before any report is uploaded', () => {
  const viewModel = buildReportViewModel({
    locale: 'zh-CN',
    session: {
      assessmentId: 101,
    },
  });

  assert.equal(viewModel.primaryGoal.label, '情绪/压力');
  assert.equal(viewModel.ocrStatus.state, 'pending');
  assert.match(viewModel.ocrStatus.actionLabel, /OCR/);
});
