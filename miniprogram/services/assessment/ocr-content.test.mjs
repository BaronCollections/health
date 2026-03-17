import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatOcrFileSize,
  getOcrConfirmationContent,
  getOcrUploadContent,
  mergeOcrConfirmationSections,
} from './ocr-content.js';

test('getOcrUploadContent returns bilingual OCR upload copy', () => {
  const zh = getOcrUploadContent('zh-CN');
  const en = getOcrUploadContent('en');

  assert.equal(zh.header.title, '上传体检报告');
  assert.equal(en.header.title, 'Upload a health report');
  assert.equal(zh.steps.length, 3);
  assert.equal(en.steps.length, 3);
});

test('mergeOcrConfirmationSections overlays OCR API values onto the local confirmation template', () => {
  const content = getOcrConfirmationContent('en');

  const merged = mergeOcrConfirmationSections(content.sections, [
    {
      id: 'baseline',
      fields: [
        {
          id: 'vitamin-d',
          value: '22 ng/mL',
          confidence: 'high',
        },
      ],
    },
  ]);

  assert.equal(merged[0].fields[0].value, '22 ng/mL');
  assert.equal(merged[0].fields[0].confidence, 'high');
  assert.equal(merged[0].fields[0].label, '25-OH Vitamin D');
});

test('formatOcrFileSize normalizes file size units for upload and confirmation pages', () => {
  assert.equal(formatOcrFileSize(980), '980 B');
  assert.equal(formatOcrFileSize(4096), '4.0 KB');
  assert.equal(formatOcrFileSize(6 * 1024 * 1024), '6.0 MB');
});
