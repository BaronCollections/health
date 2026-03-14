import type { Locale } from "@/i18n/types"

export type QuestionnaireLocale = Locale

export type QuestionnaireShowCondition = {
  allTags?: string[]
  anyTags?: string[]
  noneTags?: string[]
}

export type QuestionnaireOption = {
  label: string
  value: string
  score: number | null
  tags?: string[]
  showForTags?: string[]
}

export type QuestionnaireField = {
  key: string
  label: string
  inputType: string
  min?: number
  max?: number
  required?: boolean
}

export type QuestionnaireQuestion = {
  id: string
  dimension: string
  type: "single_choice" | "multi_choice" | "group_input"
  title: string
  description?: string
  required: boolean
  autoNext?: boolean
  showIf?: QuestionnaireShowCondition[]
  options?: QuestionnaireOption[]
  fields?: QuestionnaireField[]
}

export type QuestionnaireBank = {
  meta: {
    name: string
    version: string
  }
  scoring: {
    dimensionWeightsDefault: Record<string, number>
    multiSelectScoringRule: {
      mode: string
    }
  }
  questions: QuestionnaireQuestion[]
}

export type QuestionnaireTranslationBank = {
  titles: Record<string, string>
  descriptions?: Record<string, string>
  fields?: Record<string, Record<string, string>>
  options?: Record<string, Record<string, string>>
}
