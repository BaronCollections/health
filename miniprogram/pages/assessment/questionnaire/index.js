import { ASSESSMENT_ROUTES } from '../../../config/routes.js';
import { createRequestClient } from '../../../services/request/client.js';
import { createAssessmentApi } from '../../../services/assessment/api.js';
import { getAssessmentQuestionBank, getAssessmentQuestionById } from '../../../services/assessment/question-bank.js';
import { createAssessmentSessionStore } from '../../../services/assessment/session.js';

function getStores() {
  return getApp().globalData;
}

const assessmentSessionStore = createAssessmentSessionStore();

Page({
  data: {
    locale: 'zh-CN',
    copy: null,
    currentQuestion: null,
    currentIndex: 0,
    totalQuestions: 0,
    assessmentId: null,
    answers: {},
    formValues: {},
    isSubmitting: false,
    errorMessage: '',
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        copy: snapshot.copy.assessmentFlow,
      });
      this.refreshCurrentQuestion();
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      copy: snapshot.copy.assessmentFlow,
    });

    const request = createRequestClient();
    this.assessmentApi = createAssessmentApi({ request });
    this.bootstrap();
  },

  onUnload() {
    this.unsubscribe?.();
  },

  async bootstrap() {
    const cachedSession = assessmentSessionStore.read();

    if (cachedSession) {
      this.applySession(cachedSession);
      return;
    }

    try {
      const resumed = await this.assessmentApi.resumeAssessment();

      if (resumed?.assessmentId) {
        assessmentSessionStore.save({
          ...resumed,
          answers: {},
        });
        this.applySession({
          ...resumed,
          answers: {},
        });
        return;
      }
    } catch {
      // fall through to create
    }

    const created = await this.assessmentApi.createAssessment();
    assessmentSessionStore.save({
      ...created,
      answers: {},
    });
    this.applySession({
      ...created,
      answers: {},
    });
  },

  applySession(session) {
    this.setData({
      assessmentId: session.assessmentId,
      currentIndex: session.currentIndex,
      totalQuestions: session.totalQuestions,
      answers: session.answers || {},
      formValues: {},
    });
    this.refreshCurrentQuestion(session.currentQuestionId, session.answers || {});
  },

  refreshCurrentQuestion(questionId = null, answers = this.data.answers) {
    const bank = getAssessmentQuestionBank(this.data.locale);
    const currentQuestionId = questionId || bank[this.data.currentIndex]?.id || null;
    const currentQuestion = currentQuestionId ? getAssessmentQuestionById(this.data.locale, currentQuestionId) : null;

    this.setData({
      currentQuestion,
      answers,
    });
  },

  handleOptionSelect(event) {
    const { value } = event.currentTarget.dataset;
    void this.submitAnswer(value);
  },

  handleFieldInput(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({
      formValues: {
        ...this.data.formValues,
        [key]: event.detail.value,
      },
    });
  },

  handleGroupSubmit() {
    void this.submitAnswer(this.data.formValues);
  },

  async submitAnswer(value) {
    if (!this.data.currentQuestion || !this.data.assessmentId) {
      return;
    }

    this.setData({
      isSubmitting: true,
      errorMessage: '',
    });

    const nextAnswers = {
      ...this.data.answers,
      [this.data.currentQuestion.id]: value,
    };

    try {
      const response = await this.assessmentApi.submitAnswer(this.data.assessmentId, {
        questionId: this.data.currentQuestion.id,
        value,
      });

      if (response.status === 'completed') {
        assessmentSessionStore.save({
          ...response,
          answers: nextAnswers,
        });
        wx.navigateTo({
          url: `${ASSESSMENT_ROUTES.resultLoading}?assessmentId=${this.data.assessmentId}`,
        });
        return;
      }

      const session = {
        ...response,
        answers: nextAnswers,
      };
      assessmentSessionStore.save(session);
      this.applySession(session);
    } catch (error) {
      this.setData({
        errorMessage: error?.message || 'Submit failed',
      });
    } finally {
      this.setData({
        isSubmitting: false,
        formValues: {},
      });
    }
  },
});
