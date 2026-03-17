function resolveErrorMessage(error) {
  return error?.errMsg || error?.message || 'Request failed';
}

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

function defaultWxLogin() {
  return new Promise((resolve, reject) => {
    if (!globalThis.wx?.login) {
      reject(new Error('wx.login is unavailable'));
      return;
    }

    wx.login({
      success: resolve,
      fail: reject,
    });
  });
}

export function createMiniProgramAuthApi({ request, wxLogin = defaultWxLogin } = {}) {
  if (!request) {
    throw new Error('Request function is required');
  }

  return {
    async loginWithWeChat() {
      const loginResult = await wxLogin().catch((error) => {
        throw new Error(resolveErrorMessage(error));
      });

      return unwrapResult(await request({
        url: '/miniprogram/auth/login',
        method: 'POST',
        data: {
          code: loginResult.code,
        },
      }));
    },

    async sendSmsCode(phone) {
      return unwrapResult(await request({
        url: '/miniprogram/auth/sms/send',
        method: 'POST',
        data: {
          phone,
        },
      }));
    },

    async bindPhone({ phone, smsCode, bindToken }) {
      return unwrapResult(await request({
        url: '/miniprogram/auth/bind',
        method: 'POST',
        data: {
          phone,
          smsCode,
          bindToken,
        },
      }));
    },

    async refreshSession() {
      return unwrapResult(await request({
        url: '/miniprogram/auth/refresh',
        method: 'POST',
      }));
    },

    async getProfile() {
      return unwrapResult(await request({
        url: '/miniprogram/auth/me',
        method: 'GET',
      }));
    },
  };
}
