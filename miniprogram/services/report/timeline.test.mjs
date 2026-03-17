import assert from 'node:assert/strict';
import test from 'node:test';

import { buildTimelineViewModel } from './timeline.js';

test('buildTimelineViewModel returns the localized timeline overview and snapshots', () => {
  const viewModel = buildTimelineViewModel({
    locale: 'en',
  });

  assert.equal(viewModel.header.title, 'Poster history timeline');
  assert.equal(viewModel.overview.scoreValue, '49 / 100');
  assert.equal(viewModel.snapshots.length, 3);
  assert.equal(viewModel.snapshots[0].dateLabel, '2026.03');
});

test('buildTimelineViewModel marks the latest OCR milestone when confirmation data exists', () => {
  const viewModel = buildTimelineViewModel({
    locale: 'zh-CN',
    session: {
      ocrResult: {
        status: 'confirmed',
        confirmedAt: '2026-03-17T02:00:00Z',
      },
    },
  });

  assert.equal(viewModel.latestMilestoneState, 'confirmed');
  assert.match(viewModel.snapshots[0].highlight, /OCR/);
  assert.equal(viewModel.actions.secondary, '返回当前报告');
});
