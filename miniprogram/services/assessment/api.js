function unwrapResult(response) {
  const payload = response?.data;

  if (!payload) {
    throw new Error('Empty response payload');
  }

  if (payload.code !== 200) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

export function createAssessmentApi({ request } = {}) {
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
  };
}
