"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SharedNav } from "./shared-nav"

type QuestionOption = {
  id: number
  label: string
  icon?: string
}

type QuestionInput = {
  id: string
  label: string
  unit: string
  min: number
  max: number
  placeholder: string
}

type Question =
  | {
      id: string
      content: string
      type: "single"
      options: QuestionOption[]
    }
  | {
      id: string
      content: string
      type: "input"
      inputs: QuestionInput[]
    }

const questions: Question[] = [
  {
    id: "B01",
    content: "你的性别是？",
    type: "single",
    options: [
      { id: 1, label: "男", icon: "👦" },
      { id: 2, label: "女", icon: "👧" },
    ],
  },
  {
    id: "B02",
    content: "你的年龄是？",
    type: "single",
    options: [
      { id: 1, label: "3岁以下" },
      { id: 2, label: "4-12岁" },
      { id: 3, label: "13-17岁" },
      { id: 4, label: "18-35岁" },
      { id: 5, label: "36-59岁" },
      { id: 6, label: "60-70岁" },
      { id: 7, label: "70岁以上" },
    ],
  },
  {
    id: "B03",
    content: "你的身高（cm）和体重（kg）是？",
    type: "input",
    inputs: [
      { id: "height", label: "身高", unit: "cm", min: 100, max: 250, placeholder: "请输入身高" },
      { id: "weight", label: "体重", unit: "kg", min: 20, max: 200, placeholder: "请输入体重" },
    ],
  },
  {
    id: "B04",
    content: "你所在的地域是？",
    type: "single",
    options: [
      { id: 1, label: "北方" },
      { id: 2, label: "南方" },
      { id: 3, label: "中部" },
    ],
  },
  {
    id: "L01",
    content: "你平均每天的睡眠时长是？",
    type: "single",
    options: [
      { id: 1, label: "少于6小时" },
      { id: 2, label: "6-7小时" },
      { id: 3, label: "7-8小时" },
      { id: 4, label: "8小时以上" },
    ],
  },
]

type PageType = "home" | "fill" | "submit"

export function AIHealthChat() {
  const [page, setPage] = useState<PageType>("home")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number | Record<string, number>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionnaire_answers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("questionnaire_answers", JSON.stringify(answers))
    }
  }, [answers])

  const totalQuestions = questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const currentQ = questions[currentQuestion]
  const hasAnswer = answers[currentQ?.id] !== undefined

  const handleSelectOption = (questionId: string, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleInputChange = (questionId: string, inputId: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] as Record<string, number> || {}),
        [inputId]: numValue,
      },
    }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setPage("submit")
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      localStorage.removeItem("questionnaire_answers")
      window.location.href = "/report"
    }, 2000)
  }

  // 问卷首页
  if (page === "home") {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <header className="px-5 pt-14 pb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🍋</span>
              <h1 className="text-lg font-bold text-foreground">健康营养评估</h1>
            </div>
            <p className="text-sm text-muted-foreground">3-5分钟完成，生成专属报告</p>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-5">
          <div
            className="w-full rounded-xl p-8 flex flex-col items-center bg-primary"
            style={{
              border: "2px solid var(--accent)",
              boxShadow: "0 4px 12px rgba(255,209,102,0.2)",
            }}
          >
            <button
              onClick={() => setPage("fill")}
              className="w-4/5 py-3 bg-background text-primary text-lg font-bold rounded-lg hover:bg-accent transition-colors"
            >
              开始测评
            </button>
            <p className="text-sm text-primary-foreground mt-4">支持中途保存、分步填写</p>
          </div>
        </main>

        <footer className="px-5 pb-24 text-center">
          <p className="text-xs text-muted-foreground">适合3岁以上全人群，儿童需家长协助填写</p>
        </footer>

        <SharedNav />
      </div>
    )
  }

  // 问卷提交页
  if (page === "submit") {
    const answeredCount = Object.keys(answers).length
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <header className="px-5 pt-14 pb-4 text-center">
          <h1 className="text-lg font-bold text-foreground">确认提交</h1>
          <p className="text-sm text-muted-foreground mt-1">提交后将生成专属健康报告</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-5">
          <div
            className="w-full bg-card rounded-xl p-6 border border-border text-center"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <p className="text-base font-bold text-foreground">
              已完成 {answeredCount}/{totalQuestions} 题
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {answeredCount < 5
                ? "已答题数较少，报告精准度可能下降"
                : "未答题将视为放弃，不影响基础报告生成"}
            </p>
          </div>

          <div className="flex gap-3 mt-8 w-full">
            <button
              onClick={() => setPage("fill")}
              className="flex-1 py-3 bg-card border border-border text-foreground text-base font-medium rounded-lg"
            >
              返回修改
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary text-primary-foreground text-base font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "确认提交"
              )}
            </button>
          </div>
        </main>

        <SharedNav />
      </div>
    )
  }

  // 问卷填写页
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* 顶部进度条 */}
      <div className="pt-12 px-5">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {currentQuestion + 1} / {totalQuestions}
        </p>
      </div>

      {/* 题目区域 */}
      <main className="flex-1 px-5 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-primary">{currentQ.id}</span>
            <span className="text-base text-foreground">{currentQ.content}</span>
          </div>
        </div>

        {/* 选项区域 */}
        {currentQ.type === "single" && (
          <div className="space-y-3">
            {currentQ.options?.map((option) => {
              const isSelected = answers[currentQ.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(currentQ.id, option.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? "bg-accent border-primary"
                      : "bg-card border-border hover:border-primary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {option.icon && <span className="text-xl">{option.icon}</span>}
                  <span className={`text-base ${isSelected ? "text-foreground font-medium" : "text-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {currentQ.type === "input" && (
          <div className="space-y-4">
            {currentQ.inputs?.map((input) => (
              <div key={input.id}>
                <label className="text-sm text-muted-foreground mb-2 block">{input.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={input.min}
                    max={input.max}
                    placeholder={input.placeholder}
                    value={(answers[currentQ.id] as Record<string, number>)?.[input.id] || ""}
                    onChange={(e) => handleInputChange(currentQ.id, input.id, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-border text-base text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <span className="text-sm text-muted-foreground">{input.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 操作区域 */}
      <div className="px-5 pb-24">
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-1 transition-colors ${
              currentQuestion === 0
                ? "bg-secondary border-secondary text-muted-foreground"
                : "bg-card border-border text-muted-foreground hover:border-primary"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一题
          </button>
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-1 font-bold transition-colors ${
              hasAnswer
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? "提交" : "下一题"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
