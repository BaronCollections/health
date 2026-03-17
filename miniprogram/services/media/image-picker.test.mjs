import assert from 'node:assert/strict';
import test from 'node:test';

import { pickImages } from './image-picker.js';

test('pickImages uses chooseMedia when available and normalizes image assets', async () => {
  const result = await pickImages({
    wxApi: {
      chooseMedia(options) {
        options.success({
          tempFiles: [
            {
              tempFilePath: '/tmp/community-a.png',
              size: 2048,
              fileType: 'image',
            },
            {
              tempFilePath: '/tmp/community-b.jpg',
              size: 4096,
              fileType: 'image',
            },
          ],
        });
      },
    },
    count: 2,
  });

  assert.equal(result.length, 2);
  assert.equal(result[0].name, 'community-a.png');
  assert.equal(result[0].tempFilePath, '/tmp/community-a.png');
  assert.equal(result[0].type, 'image');
  assert.equal(result[1].name, 'community-b.jpg');
});

test('pickImages falls back to chooseImage when chooseMedia is unavailable', async () => {
  const calls = [];
  const result = await pickImages({
    wxApi: {
      chooseImage(options) {
        calls.push(options.count);
        options.success({
          tempFilePaths: ['/tmp/fallback-a.png'],
          tempFiles: [
            {
              path: '/tmp/fallback-a.png',
              size: 1024,
            },
          ],
        });
      },
    },
    count: 1,
  });

  assert.deepEqual(calls, [1]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'fallback-a.png');
  assert.equal(result[0].size, 1024);
  assert.equal(result[0].type, 'image');
});
