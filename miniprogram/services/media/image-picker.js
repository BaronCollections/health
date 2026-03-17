function createAssetId(filePath, index) {
  return `image-${Date.now()}-${index}-${filePath.split('/').pop() || 'asset'}`;
}

function getFileName(filePath = '') {
  return filePath.split('/').pop() || 'image';
}

function normalizeTempFiles(tempFiles = []) {
  return tempFiles.map((file, index) => {
    const tempFilePath = file.tempFilePath || file.path || '';

    return {
      id: createAssetId(tempFilePath, index),
      name: getFileName(tempFilePath),
      tempFilePath,
      size: file.size || 0,
      type: file.fileType || 'image',
    };
  });
}

function runChooseMedia(wxApi, count) {
  return new Promise((resolve, reject) => {
    wxApi.chooseMedia({
      count,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(result) {
        resolve(normalizeTempFiles(result.tempFiles || []));
      },
      fail: reject,
    });
  });
}

function runChooseImage(wxApi, count) {
  return new Promise((resolve, reject) => {
    wxApi.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(result) {
        const tempFiles = (result.tempFiles || []).map((file, index) => ({
          path: file.path || result.tempFilePaths?.[index] || '',
          size: file.size || 0,
        }));

        resolve(normalizeTempFiles(tempFiles));
      },
      fail: reject,
    });
  });
}

export async function pickImages({ wxApi = globalThis.wx, count = 3 } = {}) {
  if (!wxApi) {
    throw new Error('WeChat runtime is required');
  }

  if (typeof wxApi.chooseMedia === 'function') {
    return runChooseMedia(wxApi, count);
  }

  if (typeof wxApi.chooseImage === 'function') {
    return runChooseImage(wxApi, count);
  }

  throw new Error('Image picker is unavailable');
}
