import { COMMUNITY_ROUTES } from '../../../../config/routes.js';
import { createCommunityApi } from '../../../../services/community/api.js';
import {
  buildCommunityCreateViewModel,
  createFallbackCommunityPost,
  getCommunityContent,
} from '../../../../services/community/index.js';
import { pickImages } from '../../../../services/media/image-picker.js';
import { createCommunityStateStore } from '../../../../services/community/session.js';
import { createRequestClient } from '../../../../services/request/client.js';

const communityStateStore = createCommunityStateStore();

function getStores() {
  return getApp().globalData;
}

Page({
  data: {
    locale: 'zh-CN',
    brandName: 'MintBit',
    backLabel: '返回',
    viewModel: null,
    selectedCircleId: '',
    selectedTags: [],
    selectedImages: [],
    contentValue: '',
    errorMessage: '',
  },

  onLoad(query) {
    const { appStore, authStore } = getStores();

    this.initialCircleId = query.circleId && query.circleId !== 'all' ? query.circleId : '';
    this.communityApi = createCommunityApi({
      request: createRequestClient({
        getLocale: () => appStore.getSnapshot().locale,
        getSession: () => authStore.getSnapshot(),
      }),
    });

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.applySnapshot(snapshot);
    });

    this.applySnapshot(appStore.hydrate());
  },

  onUnload() {
    this.unsubscribe?.();
  },

  applySnapshot(snapshot) {
    this.setData({
      locale: snapshot.locale,
      brandName: snapshot.copy.brandName,
      backLabel: snapshot.copy.common.back,
    });
    this.applyViewModel(snapshot.locale);
  },

  applyViewModel(locale = this.data.locale) {
    const defaultCircleId = this.data.selectedCircleId || this.initialCircleId || getCommunityContent(locale).circles[0].id;
    const viewModel = buildCommunityCreateViewModel({
      locale,
      selectedCircleId: defaultCircleId,
    });

    this.setData({
      selectedCircleId: defaultCircleId,
      viewModel: {
        ...viewModel,
        tagOptions: viewModel.tagOptions.map((option) => ({
          ...option,
          selected: this.data.selectedTags.includes(option.id),
        })),
      },
    });
  },

  handleCircleSelect(event) {
    this.setData(
      {
        selectedCircleId: event.currentTarget.dataset.circleId,
      },
      () => {
        this.applyViewModel();
      },
    );
  },

  handleTagToggle(event) {
    const tag = event.currentTarget.dataset.tag;
    const selectedTags = this.data.selectedTags.includes(tag)
      ? this.data.selectedTags.filter((entry) => entry !== tag)
      : [...this.data.selectedTags, tag];

    this.setData(
      {
        selectedTags,
      },
      () => {
        this.applyViewModel();
      },
    );
  },

  handleContentInput(event) {
    this.setData({
      contentValue: event.detail.value,
    });
  },

  async handleAddImages() {
    const remaining = Math.max(0, 3 - this.data.selectedImages.length);

    if (!remaining) {
      return;
    }

    try {
      const nextImages = await pickImages({
        count: remaining,
      });

      this.setData({
        selectedImages: [...this.data.selectedImages, ...nextImages].slice(0, 3),
      });
    } catch (error) {
      if (!String(error?.errMsg || error?.message || '').includes('cancel')) {
        wx.showToast({
          title: this.data.locale === 'zh-CN' ? '选图失败' : 'Image selection failed',
          icon: 'none',
        });
      }
    }
  },

  handleRemoveImage(event) {
    const imageId = event.currentTarget.dataset.imageId;
    this.setData({
      selectedImages: this.data.selectedImages.filter((image) => image.id !== imageId),
    });
  },

  handlePreviewImage(event) {
    const current = event.currentTarget.dataset.imagePath;
    const urls = this.data.selectedImages.map((image) => image.tempFilePath).filter(Boolean);

    if (!current || !urls.length) {
      return;
    }

    wx.previewImage({
      current,
      urls,
    });
  },

  async handleSubmit() {
    const content = this.data.contentValue.trim();

    if (!content) {
      this.setData({
        errorMessage: this.data.locale === 'zh-CN' ? '请先填写正文内容。' : 'Please write the post content first.',
      });
      return;
    }

    const payload = {
      circleId: this.data.selectedCircleId,
      content,
      tags: this.data.selectedTags,
      images: this.data.selectedImages,
    };

    let createdPost;

    try {
      createdPost = await this.communityApi.createPost(payload);
    } catch {
      createdPost = createFallbackCommunityPost(this.data.locale, payload);
    }

    communityStateStore.upsertPost(createdPost);
    wx.showToast({
      title: this.data.viewModel.header.title === '发布一条新的进展' ? '已提交' : 'Sent',
      icon: 'success',
      duration: 1200,
    });
    setTimeout(() => {
      wx.redirectTo({
        url: `${COMMUNITY_ROUTES.myPosts}?status=pending_review`,
      });
    }, 300);
  },
});
