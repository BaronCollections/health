const BASE_QUESTIONS = [
  {
    id: 'B01',
    type: 'single_choice',
    title: '你的性别是？',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    id: 'B02',
    type: 'single_choice',
    title: '你的年龄是？',
    options: [
      { label: '3岁以下', value: 'age_0_3' },
      { label: '4-12岁', value: 'age_4_12' },
      { label: '13-17岁', value: 'age_13_17' },
      { label: '18-35岁', value: 'age_18_35' },
      { label: '36-59岁', value: 'age_36_59' },
      { label: '60-70岁', value: 'age_60_70' },
      { label: '70岁以上', value: 'age_70_plus' },
    ],
  },
  {
    id: 'B03',
    type: 'group_input',
    title: '你的身高（cm）和体重（kg）是？',
    fields: [
      { key: 'heightCm', label: '身高(cm)', inputType: 'number' },
      { key: 'weightKg', label: '体重(kg)', inputType: 'number' },
    ],
  },
];

const EN_TRANSLATIONS = {
  titles: {
    B01: 'What is your gender?',
    B02: 'What is your age?',
    B03: 'What are your height (cm) and weight (kg)?',
  },
  fields: {
    B03: {
      heightCm: 'Height (cm)',
      weightKg: 'Weight (kg)',
    },
  },
  options: {
    B01: {
      male: 'Male',
      female: 'Female',
    },
    B02: {
      age_0_3: 'Under 3',
      age_4_12: '4-12',
      age_13_17: '13-17',
      age_18_35: '18-35',
      age_36_59: '36-59',
      age_60_70: '60-70',
      age_70_plus: 'Over 70',
    },
  },
};

function translateQuestion(question) {
  if (question.type === 'group_input') {
    return {
      ...question,
      title: EN_TRANSLATIONS.titles[question.id] || question.title,
      fields: question.fields.map((field) => ({
        ...field,
        label: EN_TRANSLATIONS.fields?.[question.id]?.[field.key] || field.label,
      })),
    };
  }

  return {
    ...question,
    title: EN_TRANSLATIONS.titles[question.id] || question.title,
    options: question.options.map((option) => ({
      ...option,
      label: EN_TRANSLATIONS.options?.[question.id]?.[option.value] || option.label,
    })),
  };
}

export function getAssessmentQuestionBank(locale = 'zh-CN') {
  if (locale === 'en') {
    return BASE_QUESTIONS.map((question) => translateQuestion(question));
  }

  return BASE_QUESTIONS;
}

export function getAssessmentQuestionById(locale, questionId) {
  return getAssessmentQuestionBank(locale).find((question) => question.id === questionId) || null;
}
