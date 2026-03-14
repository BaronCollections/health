"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import {
  getQuestionDescription,
  getQuestionFieldLabel,
  getQuestionOptionLabel,
  getQuestionTitle,
  questionBank,
} from "@/lib/questionnaire"
import type {
  QuestionnaireField,
  QuestionnaireOption,
  QuestionnaireQuestion,
  QuestionnaireShowCondition,
} from "@/lib/questionnaire/types"

const STORAGE_KEY = "ffq_questionnaire_cache"

export function QuestionnaireFlow() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, number>>>({})
  const [userTags, setUserTags] = useState<string[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState(questionBank.questions)
  const [groupInputValues, setGroupInputValues] = useState<Record<string, number>>({})
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)

  // 从缓存恢复
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        const data = JSON.parse(cached)
        const cacheAge = Date.now() - (data.timestamp || 0)
        // 7天有效期
        if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
          setAnswers(data.answers || {})
          setUserTags(data.userTags || [])
          setCurrentIndex(data.currentIndex || 0)
          setBmi(data.bmi || null)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (e) {
        console.error("Failed to parse cache", e)
      }
    }
  }, [])

  // 保存到缓存
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers,
        userTags,
        currentIndex,
        bmi,
        timestamp: Date.now(),
      }))
    }
  }, [answers, userTags, currentIndex, bmi])

  // 根据userTags过滤题目
  useEffect(() => {
    const filtered = questionBank.questions.filter((q) => {
      if (!q.showIf || q.showIf.length === 0) return true
      
      return q.showIf.some((condition: QuestionnaireShowCondition) => {
        if (condition.allTags) {
          return condition.allTags.every((tag: string) => userTags.includes(tag))
        }
        if (condition.anyTags) {
          return condition.anyTags.some((tag: string) => userTags.includes(tag))
        }
        if (condition.noneTags) {
          return !condition.noneTags.some((tag: string) => userTags.includes(tag))
        }
        return true
      })
    })
    setFilteredQuestions(filtered)
  }, [userTags])

  const currentQuestion = filteredQuestions[currentIndex]
  const progress = filteredQuestions.length > 0 
    ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100) 
    : 0

  const handleSingleSelect = (value: string, option: { tags?: string[] }) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    
    // 更新userTags
    if (option.tags && option.tags.length > 0) {
      setUserTags((prev) => {
        const newTags = [...prev]
        option.tags?.forEach((tag: string) => {
          if (!newTags.includes(tag)) {
            newTags.push(tag)
          }
        })
        return newTags
      })
    }
    
    if (currentQuestion.autoNext) {
      setTimeout(() => {
        if (currentIndex < filteredQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setMultiSelected([])
        } else {
          handleSubmit()
        }
      }, 300)
    }
  }

  const handleMultiSelect = (value: string) => {
    // "无" 选项互斥逻辑
    if (value === "none") {
      setMultiSelected(["none"])
      return
    }
    
    let newSelected = multiSelected.filter((v) => v !== "none")
    
    if (newSelected.includes(value)) {
      newSelected = newSelected.filter((v) => v !== value)
    } else {
      newSelected.push(value)
    }
    
    setMultiSelected(newSelected)
  }

  const handleMultiNext = () => {
    if (multiSelected.length === 0) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: multiSelected }))
    
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setMultiSelected([])
    } else {
      handleSubmit()
    }
  }

  const handleGroupInput = () => {
    const q = currentQuestion as { fields?: QuestionnaireField[] }
    if (!q.fields) return
    
    const isValid = q.fields.every((field) => {
      const val = groupInputValues[field.key]
      return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
    })
    
    if (!isValid) return
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...groupInputValues } }))
    
    // 计算BMI
    if (currentQuestion.id === "B03") {
      const h = groupInputValues.heightCm
      const w = groupInputValues.weightKg
      if (h && w) {
        const calculatedBmi = Math.round((w / ((h / 100) ** 2)) * 100) / 100
        setBmi(calculatedBmi)
      }
    }
    
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setGroupInputValues({})
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setMultiSelected([])
      setGroupInputValues({})
    } else {
      router.back()
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // 计算分数
    const scores = calculateScores()
    
    // 存储结果
    localStorage.setItem("ffq_result", JSON.stringify({
      answers,
      userTags,
      bmi,
      scores,
      timestamp: Date.now(),
    }))
    
    // 清除问卷缓存
    localStorage.removeItem(STORAGE_KEY)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setShowComplete(true)
      
      setTimeout(() => {
        router.push("/report")
      }, 2000)
    }, 1500)
  }

  const calculateScores = () => {
    const dimensionScores: Record<string, number> = {
      lifestyle: 0,
      diet: 0,
      health: 0,
      goal: 0,
    }
    const dimensionMax: Record<string, number> = {
      lifestyle: 0,
      diet: 0,
      health: 0,
      goal: 0,
    }
    
    filteredQuestions.forEach((q) => {
      if (q.dimension === "basic" || q.dimension === "goal") return
      
      const answer = answers[q.id]
      if (!answer) return
      
      // 计算该维度最大分
      const maxScore = q.options?.reduce((max: number, o: QuestionnaireOption) => Math.max(max, o.score || 0), 0) || 5
      dimensionMax[q.dimension] = (dimensionMax[q.dimension] || 0) + maxScore
      
      if (q.type === "single_choice") {
        const option = q.options?.find((o: QuestionnaireOption) => o.value === answer)
        if (option?.score) {
          dimensionScores[q.dimension] = (dimensionScores[q.dimension] || 0) + option.score
        }
      } else if (q.type === "multi_choice" && Array.isArray(answer)) {
        // 多选取最低分
        const scores = answer.map((v) => {
          const option = q.options?.find((o: QuestionnaireOption) => o.value === v)
          return option?.score || 3
        })
        dimensionScores[q.dimension] = (dimensionScores[q.dimension] || 0) + Math.min(...scores)
      }
    })
    
    // 归一化分数
    const dimensionNormalized: Record<string, number> = {}
    for (const dim of Object.keys(dimensionScores)) {
      if (dimensionMax[dim] > 0) {
        dimensionNormalized[dim] = Math.round((dimensionScores[dim] / dimensionMax[dim]) * 100)
      } else {
        dimensionNormalized[dim] = 0
      }
    }
    
    // 计算综合分
    const weights = questionBank.scoring.dimensionWeightsDefault
    const totalScore = Math.round(
      (dimensionNormalized.lifestyle || 0) * weights.lifestyle +
      (dimensionNormalized.diet || 0) * weights.diet +
      (dimensionNormalized.health || 0) * weights.health +
      (dimensionNormalized.goal || 0) * weights.goal
    )
    
    return {
      dimensionScores,
      dimensionMax,
      dimensionNormalized,
      totalScore: Math.min(100, Math.max(0, totalScore)),
      level: totalScore >= 80 ? "high" : totalScore >= 60 ? "mid" : "low",
    }
  }

  // 过滤G01的选项（根据userTags）
  const getFilteredOptions = (question: QuestionnaireQuestion) => {
    if (!question.options) return []
    
    return question.options.filter((opt) => {
      if (!("showForTags" in opt) || !opt.showForTags) return true
      return opt.showForTags.some((tag: string) => userTags.includes(tag))
    })
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        
        {/* 进度条 - 带动画效果 */}
        <div className="h-1.5 bg-muted mx-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-[#66CDAA] transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* 闪光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        {/* 进度文字 */}
        <div className="flex justify-between px-4 mt-1">
          <span className="text-[10px] text-muted-foreground">{currentIndex + 1}/{filteredQuestions.length}</span>
          <span className="text-[10px] text-primary font-medium">{progress}%</span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 px-5 py-8">
        {/* 问题标题 */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {getQuestionTitle(currentQuestion, locale)}
        </h1>
        
        {getQuestionDescription(currentQuestion, locale) && (
          <p className="text-sm text-muted-foreground mb-6">
            {getQuestionDescription(currentQuestion, locale)}
          </p>
        )}

        {/* 选项区 */}
        <div className="mt-6 space-y-3">
          {currentQuestion.type === "single_choice" && currentQuestion.options?.map((option: QuestionnaireOption, index: number) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect(option.value, option)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                answers[currentQuestion.id] === option.value
                  ? "border-primary bg-[#E8FFE8] shadow-sm"
                  : "border-border bg-white hover:border-primary/50 hover:bg-[#FAFFF8]"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  answers[currentQuestion.id] === option.value ? "text-primary" : "text-foreground"
                }`}>
                  {getQuestionOptionLabel(currentQuestion.id, option, locale)}
                </span>
                {answers[currentQuestion.id] === option.value && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}

          {currentQuestion.type === "multi_choice" && (
            <>
              {getFilteredOptions(currentQuestion).map((option: QuestionnaireOption) => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    multiSelected.includes(option.value)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-white hover:border-primary/50"
                  }`}
                >
                  <span className={`font-medium ${
                    multiSelected.includes(option.value) ? "text-primary" : "text-foreground"
                  }`}>
                    {getQuestionOptionLabel(currentQuestion.id, option, locale)}
                  </span>
                  {multiSelected.includes(option.value) && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
              
              {/* 下一步按钮 */}
              <button
                onClick={handleMultiNext}
                disabled={multiSelected.length === 0}
                className={`w-full py-4 rounded-xl font-medium mt-6 transition-all ${
                  multiSelected.length > 0
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("questionnaire.next")}
              </button>
            </>
          )}

          {currentQuestion.type === "group_input" && (
            <div className="space-y-4">
              {(currentQuestion as { fields?: QuestionnaireField[] }).fields?.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground w-20">
                    {getQuestionFieldLabel(currentQuestion.id, field, locale)}
                  </label>
                  <input
                    type="number"
                    value={groupInputValues[field.key] || ""}
                    onChange={(e) => setGroupInputValues(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    min={field.min}
                    max={field.max}
                    className="flex-1 p-4 rounded-xl border-2 border-border bg-white text-lg font-medium text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
              
              <button
                onClick={handleGroupInput}
                disabled={!(currentQuestion as { fields?: QuestionnaireField[] }).fields?.every((field) => {
                  const val = groupInputValues[field.key]
                  return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
                })}
                className={`w-full py-4 rounded-xl font-medium mt-4 transition-all ${
                  (currentQuestion as { fields?: QuestionnaireField[] }).fields?.every((field) => {
                    const val = groupInputValues[field.key]
                    return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
                  })
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("questionnaire.next")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 提交中/完成弹窗 */}
      {(isSubmitting || showComplete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 mx-6 text-center animate-in zoom-in-95 duration-200">
            {isSubmitting ? (
              <>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">{t("questionnaire.generatingTitle")}</p>
                <p className="text-sm text-muted-foreground mt-2">{t("questionnaire.generatingBody")}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium text-foreground">{t("questionnaire.completeTitle")}</p>
                <p className="text-sm text-muted-foreground mt-2">{t("questionnaire.completeBody")}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
