import { REPORT_ROUTES } from '../../../config/routes.js';
import { createAssessmentApi } from '../../../services/assessment/api.js';
import { formatOcrFileSize, getOcrUploadContent } from '../../../services/assessment/ocr-content.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';
import { createRequestClient } from '../../../services/request/client.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

function chooseImageFile() {
  return new Promise((resolve, reject) => {
    if (!wx.chooseMedia) {
      reject(new Error('wx.chooseMedia is unavailable'));
      return;
    }

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (result) => {
        const file = result.tempFiles?.[0];

        if (!file?.tempFilePath) {
          reject(new Error('No file selected'));
          return;
        }

        resolve({
          filePath: file.tempFilePath,
          name: file.tempFilePath.split('/').pop() || `report-${Date.now()}.jpg`,
          size: file.size || 0,
          mimeType: 'image/jpeg',
        });
      },
      fail: reject,
    });
  });
}

function choosePdfFile() {
  return new Promise((resolve, reject) => {
    if (!wx.chooseMessageFile) {
      reject(new Error('wx.chooseMessageFile is unavailable'));
      return;
    }

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf'],
      success: (result) => {
        const file = result.tempFiles?.[0];

        if (!file?.path) {
          reject(new Error('No file selected'));
          return;
        }

        resolve({
          filePath: file.path,
          name: file.name || 'report.pdf',
          size: file.size || 0,
          mimeType: 'application/pdf',
        });
      },
      fail: reject,
    });
  });
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    copy: null,
    assessmentId: null,
    status: 'idle',
    selectedFile: null,
    selectedFileName: '',
    selectedFileSizeText: '',
    fallbackNotice: '',
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

    const session = assessmentSessionStore.read();
    const assessmentId = Number(query.assessmentId || session?.assessmentId || 0) || null;

    this.setData({
      assessmentId,
    });

    if (session?.ocrUpload) {
      this.setSelectedFile(session.ocrUpload);
    }
  },

  onUnload() {
    this.unsubscribe?.();

    if (this.timer) {
      clearTimeout(this.timer);
    }
  },

  applyAppSnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
      copy: getOcrUploadContent(snapshot.locale),
    });
  },

  setSelectedFile(file) {
    this.setData({
      selectedFile: file,
      selectedFileName: file.fileName || file.name || 'report.pdf',
      selectedFileSizeText: formatOcrFileSize(file.size || file.fileSize || 0),
      status: 'ready',
      fallbackNotice: '',
    });
  },

  handleChooseFile() {
    if (!this.data.copy) {
      return;
    }

    wx.showActionSheet({
      itemList: [this.data.copy.chooseImage, this.data.copy.choosePdf],
      success: async (result) => {
        try {
          const selectedFile = result.tapIndex === 0 ? await chooseImageFile() : await choosePdfFile();
          this.setSelectedFile(selectedFile);
        } catch {
          this.setData({
            fallbackNotice: this.data.copy.chooseFailed,
          });
        }
      },
      fail: (error) => {
        if (String(error?.errMsg || '').includes('cancel')) {
          return;
        }

        this.setData({
          fallbackNotice: this.data.copy.chooseFailed,
        });
      },
    });
  },

  handleSecondaryAction() {
    wx.switchTab({
      url: REPORT_ROUTES.index,
    });
  },

  async handleStartRecognition() {
    if (!this.data.selectedFile || !this.data.copy) {
      return;
    }

    if (!this.data.assessmentId) {
      this.setData({
        fallbackNotice: this.data.copy.missingAssessment,
      });
      return;
    }

    this.setData({
      status: 'processing',
      fallbackNotice: '',
    });

    const localUpload = {
      assessmentId: this.data.assessmentId,
      fileName: this.data.selectedFile.fileName || this.data.selectedFile.name,
      filePath: this.data.selectedFile.filePath,
      fileSize: this.data.selectedFile.fileSize || this.data.selectedFile.size,
      fileType: this.data.selectedFile.fileType || this.data.selectedFile.mimeType,
      uploadedAt: new Date().toISOString(),
      syncStatus: 'local-only',
    };

    assessmentSessionStore.saveOcrUpload(localUpload);

    try {
      const response = await this.assessmentApi.uploadOcrReport(this.data.assessmentId, this.data.selectedFile);
      assessmentSessionStore.saveOcrUpload({
        assessmentId: response.assessmentId,
        fileName: response.fileName,
        filePath: this.data.selectedFile.filePath,
        fileSize: response.fileSize,
        fileType: response.fileType,
        uploadedAt: response.uploadedAt,
        taskId: response.taskId,
        syncStatus: 'uploaded',
      });
      this.setData({
        selectedFileName: response.fileName,
        selectedFileSizeText: formatOcrFileSize(response.fileSize),
      });
    } catch {
      assessmentSessionStore.saveOcrUpload({
        ...localUpload,
        syncStatus: 'sync-failed',
      });
      this.setData({
        fallbackNotice: this.data.copy.uploadFallback,
      });
    }

    this.timer = setTimeout(() => {
      wx.navigateTo({
        url: `${REPORT_ROUTES.ocrConfirmation}?assessmentId=${this.data.assessmentId}`,
      });
    }, 1200);
  },
});
