import { QUESTION_BANK_EN_TRANSLATIONS, QUESTION_BANK_SOURCE } from './question-bank-source.js';

function localizeQuestion(question, locale) {
  if (locale !== 'en') {
    return question;
  }

  return {
    ...question,
    title: QUESTION_BANK_EN_TRANSLATIONS.titles?.[question.id] || question.title,
    description: QUESTION_BANK_EN_TRANSLATIONS.descriptions?.[question.id] || question.description,
    fields: question.fields
      ? question.fields.map((field) => ({
          ...field,
          label: QUESTION_BANK_EN_TRANSLATIONS.fields?.[question.id]?.[field.key] || field.label,
        }))
      : undefined,
    options: question.options
      ? question.options.map((option) => ({
          ...option,
          label: QUESTION_BANK_EN_TRANSLATIONS.options?.[question.id]?.[option.value] || option.label,
        }))
      : undefined,
  };
}

function normalizeAnswerValues(answer) {
  if (Array.isArray(answer)) {
    return answer;
  }

  if (answer && typeof answer === 'object') {
    return [];
  }

  return answer == null ? [] : [answer];
}

function collectAnswerTags(questionBank, answers = {}) {
  const tags = new Set();

  questionBank.forEach((question) => {
    const answer = answers[question.id];

    if (answer == null || !question.options) {
      return;
    }

    const selectedValues = normalizeAnswerValues(answer);

    question.options.forEach((option) => {
      if (!selectedValues.includes(option.value)) {
        return;
      }

      (option.tags || []).forEach((tag) => tags.add(tag));
    });
  });

  return tags;
}

function matchesCondition(condition = {}, tags) {
  const allTags = condition.allTags || [];
  const anyTags = condition.anyTags || [];
  const noneTags = condition.noneTags || [];

  if (allTags.length && !allTags.every((tag) => tags.has(tag))) {
    return false;
  }

  if (anyTags.length && !anyTags.some((tag) => tags.has(tag))) {
    return false;
  }

  if (noneTags.length && noneTags.some((tag) => tags.has(tag))) {
    return false;
  }

  return true;
}

export function getAssessmentQuestionBank(locale = 'zh-CN') {
  return QUESTION_BANK_SOURCE.questions.map((question) => localizeQuestion(question, locale));
}

export function isQuestionVisible(question, answers = {}, locale = 'zh-CN') {
  if (!question.showIf || !question.showIf.length) {
    return true;
  }

  const tags = collectAnswerTags(getAssessmentQuestionBank(locale), answers);
  return question.showIf.every((condition) => matchesCondition(condition, tags));
}

export function getVisibleAssessmentQuestionBank({ locale = 'zh-CN', answers = {} } = {}) {
  const bank = getAssessmentQuestionBank(locale);
  return bank.filter((question) => isQuestionVisible(question, answers, locale));
}

export function getNextVisibleQuestion({ locale = 'zh-CN', startIndex = 0, answers = {} } = {}) {
  const bank = getAssessmentQuestionBank(locale);

  for (let index = startIndex; index < bank.length; index += 1) {
    const question = bank[index];

    if (isQuestionVisible(question, answers, locale)) {
      return {
        ...question,
        sourceIndex: index,
      };
    }
  }

  return null;
}

export function getAssessmentQuestionById(locale, questionId) {
  return getAssessmentQuestionBank(locale).find((question) => question.id === questionId) || null;
}
