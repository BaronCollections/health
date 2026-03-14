import type {
  QuestionnaireBank,
  QuestionnaireField,
  QuestionnaireLocale,
  QuestionnaireOption,
  QuestionnaireQuestion,
  QuestionnaireTranslationBank,
} from "./types"

import questionBankData from "./question-bank.json"
import englishTranslationsData from "./question-bank.en.json"

export const questionBank = questionBankData as QuestionnaireBank

const englishTranslations = englishTranslationsData as QuestionnaireTranslationBank

export function getQuestionTitle(
  question: QuestionnaireQuestion,
  locale: QuestionnaireLocale,
) {
  if (locale === "en") {
    return englishTranslations.titles[question.id] ?? question.title
  }

  return question.title
}

export function getQuestionDescription(
  question: QuestionnaireQuestion,
  locale: QuestionnaireLocale,
) {
  if (!question.description) {
    return undefined
  }

  if (locale === "en") {
    return englishTranslations.descriptions?.[question.id] ?? question.description
  }

  return question.description
}

export function getQuestionFieldLabel(
  questionId: string,
  field: QuestionnaireField,
  locale: QuestionnaireLocale,
) {
  if (locale === "en") {
    return englishTranslations.fields?.[questionId]?.[field.key] ?? field.label
  }

  return field.label
}

export function getQuestionOptionLabel(
  questionId: string,
  option: QuestionnaireOption,
  locale: QuestionnaireLocale,
) {
  if (locale === "en") {
    return englishTranslations.options?.[questionId]?.[option.value] ?? option.label
  }

  return option.label
}
