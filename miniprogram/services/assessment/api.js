import { buildApiUrl, createRequestClientConfig } from '../request/client.js';

function unwrapResult(response) {
  const rawPayload = response?.data;
  const payload = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;

  if (!payload) {
    throw new Error('Empty response payload');
  }

  if (payload.code !== 200) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

function defaultWxUploadFile(options) {
  const adapter = globalThis.wx?.uploadFile?.bind(globalThis.wx);

  if (!adapter) {
    return Promise.reject(new Error('Upload adapter is required'));
  }

  return new Promise((resolve, reject) => {
    adapter({
      ...options,
      success: resolve,
      fail: (error) => reject(new Error(error?.errMsg || 'Upload failed')),
    });
  });
}

export function createAssessmentApi({
  request,
  env,
  session,
  locale,
  appId,
  getSession,
  getLocale,
  uploadFile = defaultWxUploadFile,
} = {}) {
  if (!request) {
    throw new Error('Request function is required');
  }

  return {
    async createAssessment() {
      return unwrapResult(await request({
        url: '/assessment/create',
        method: 'POST',
        data: {},
      }));
    },

    async submitAnswer(assessmentId, answer) {
      return unwrapResult(await request({
        url: `/assessment/${assessmentId}/answer`,
        method: 'POST',
        data: answer,
      }));
    },

    async resumeAssessment() {
      return unwrapResult(await request({
        url: '/assessment/resume',
        method: 'GET',
      }));
    },

    async uploadOcrReport(assessmentId, file) {
      const resolvedSession = typeof getSession === 'function' ? getSession() : session || {};
      const resolvedLocale = typeof getLocale === 'function' ? getLocale() : locale || 'zh-CN';
      const config = createRequestClientConfig({
        env,
        session: resolvedSession,
        locale: resolvedLocale,
        appId,
      });

      return unwrapResult(await uploadFile({
        url: buildApiUrl(config.baseUrl, `/assessment/${assessmentId}/report/upload`),
        filePath: file.filePath,
        name: 'file',
        timeout: config.timeout,
        header: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
        formData: {
          fileName: file.name || 'report.pdf',
          fileType: file.mimeType || 'application/octet-stream',
        },
      }));
    },

    async getOcrResult(assessmentId) {
      return unwrapResult(await request({
        url: `/assessment/${assessmentId}/report/result`,
        method: 'GET',
      }));
    },
  };
}
