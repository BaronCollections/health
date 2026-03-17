import { ASSESSMENT_ROUTES } from '../../../config/routes.js';
import { createRequestClient } from '../../../services/request/client.js';
import { createAssessmentApi } from '../../../services/assessment/api.js';
import { getNextVisibleQuestion, getVisibleAssessmentQuestionBank } from '../../../services/assessment/question-bank.js';
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
    multiChoiceValues: [],
    isSubmitting: false,
    errorMessage: '',
    backLabel: 'Back',
  },

  onLoad() {
    const { appStore } = getStores();

    this.unsubscribe = appStore.subscribe((snapshot) => {
      this.setData({
        locale: snapshot.locale,
        copy: snapshot.copy.assessmentFlow,
        backLabel: snapshot.copy.common.back,
      });
      this.refreshCurrentQuestion();
    });

    const snapshot = appStore.hydrate();
    this.setData({
      locale: snapshot.locale,
      copy: snapshot.copy.assessmentFlow,
      backLabel: snapshot.copy.common.back,
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
      answers: session.answers || {},
      formValues: {},
      multiChoiceValues: [],
    });
    this.refreshCurrentQuestion(session.currentIndex, session.answers || {});
  },

  refreshCurrentQuestion(startIndex = this.data.currentIndex, answers = this.data.answers) {
    const visibleBank = getVisibleAssessmentQuestionBank({
      locale: this.data.locale,
      answers,
    });
    const resolvedQuestion = getNextVisibleQuestion({
      locale: this.data.locale,
      startIndex,
      answers,
    });
    const selectedValues = Array.isArray(answers[resolvedQuestion?.id]) ? answers[resolvedQuestion.id] : [];
    const currentQuestion =
      resolvedQuestion?.type === 'multi_choice'
        ? {
            ...resolvedQuestion,
            options: resolvedQuestion.options.map((option) => ({
              ...option,
              selected: selectedValues.includes(option.value),
            })),
          }
        : resolvedQuestion;
    const currentVisibleIndex = resolvedQuestion
      ? visibleBank.findIndex((question) => question.id === resolvedQuestion.id)
      : visibleBank.length;

    this.setData({
      currentQuestion,
      answers,
      currentIndex: Math.max(currentVisibleIndex, 0),
      totalQuestions: visibleBank.length,
      multiChoiceValues: selectedValues,
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

  handleMultiChoiceToggle(event) {
    const { value } = event.currentTarget.dataset;
    const nextValues = this.data.multiChoiceValues.includes(value)
      ? this.data.multiChoiceValues.filter((item) => item !== value)
      : [...this.data.multiChoiceValues, value];

    this.setData({
      multiChoiceValues: nextValues,
    });
  },

  handleMultiChoiceSubmit() {
    void this.submitAnswer(this.data.multiChoiceValues);
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
        multiChoiceValues: [],
      });
    }
  },
});
