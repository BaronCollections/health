import { REPORT_ROUTES } from '../../../config/routes.js';
import { createAssessmentApi } from '../../../services/assessment/api.js';
import {
  formatOcrFileSize,
  getOcrConfirmationContent,
  mergeOcrConfirmationSections,
} from '../../../services/assessment/ocr-content.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';
import { createRequestClient } from '../../../services/request/client.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function formatUploadMeta(locale, upload) {
  if (!upload) {
    return '';
  }

  const date = new Date(upload.uploadedAt);
  const dateText =
    locale === 'zh-CN'
      ? `${date.getMonth() + 1}月${date.getDate()}日 ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`
      : `${date.getMonth() + 1}/${date.getDate()} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;

  return `${formatOcrFileSize(upload.fileSize || 0)} · ${dateText}`;
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    copy: null,
    assessmentId: null,
    upload: null,
    hasUpload: false,
    uploadMeta: '',
    sections: [],
    fallbackNotice: '',
    isLoadingResult: false,
  },

  onLoad(query) {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applyAppSnapshot(snapshot);
    });

    const snapshot = appStore.hydrate();
    this.applyAppSnapshot(snapshot);

    const request = createRequestClient();
    this.assessmentApi = createAssessmentApi({ request });

    const session = assessmentSessionStore.read() || {};
    this.latestApiResult = session.ocrResult || null;

    const assessmentId = Number(query.assessmentId || session.assessmentId || 0) || null;
    this.setData({
      assessmentId,
      upload: session.ocrUpload || null,
      hasUpload: Boolean(session.ocrUpload),
    });

    this.refreshView();

    if (assessmentId && session.ocrUpload?.syncStatus === 'uploaded') {
      void this.loadOcrResult(assessmentId);
    }
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
      copy: getOcrConfirmationContent(snapshot.locale),
    });
    this.refreshView();
  },

  refreshView() {
    if (!this.data.copy) {
      return;
    }

    const sections = mergeOcrConfirmationSections(this.data.copy.sections, this.latestApiResult?.sections || []).map((section) => ({
      ...section,
      fields: section.fields.map((field) => ({
        ...field,
        confidenceLabel: this.data.copy.confidenceBadges[field.confidence],
      })),
    }));
    const fallbackNotice =
      !this.latestApiResult || this.data.upload?.syncStatus !== 'uploaded' ? this.data.copy.apiFallback : '';

    this.setData({
      sections,
      uploadMeta: formatUploadMeta(this.data.locale, this.data.upload),
      fallbackNotice,
    });
  },

  async loadOcrResult(assessmentId) {
    this.setData({
      isLoadingResult: true,
    });

    try {
      const result = await this.assessmentApi.getOcrResult(assessmentId);
      this.latestApiResult = result;
      assessmentSessionStore.saveOcrResult(result);
    } catch {
      this.latestApiResult = null;
    } finally {
      this.setData({
        isLoadingResult: false,
      });
      this.refreshView();
    }
  },

  handleBackToUpload() {
    wx.navigateTo({
      url: `${REPORT_ROUTES.ocrUpload}?assessmentId=${this.data.assessmentId || ''}`,
    });
  },

  handlePrimaryAction() {
    const currentSnapshot = assessmentSessionStore.read() || {};
    assessmentSessionStore.saveOcrResult({
      ...(this.latestApiResult || currentSnapshot.ocrResult || {
        assessmentId: this.data.assessmentId,
        sections: this.data.sections,
      }),
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    });

    wx.switchTab({
      url: REPORT_ROUTES.index,
    });
  },

  handleSecondaryAction() {
    wx.switchTab({
      url: REPORT_ROUTES.index,
    });
  },
});
