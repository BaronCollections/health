"use client"

import { useEffect, useState } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getChatQuestionnaireContent } from "@/lib/chat-questionnaire"

import { SharedNav } from "./shared-nav"

type QuestionAnswer = string | number | Record<string, number>
type QuestionInputAnswer = Record<string, number>

export function AIHealthChat() {
  const router = useRouter()
  const { locale } = useLocale()
  const content = getChatQuestionnaireContent(locale)
  const questions = content.questions

  const [page, setPage] = useState<"home" | "fill" | "submit">("home")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({})
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
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleInputChange = (questionId: string, inputId: string, value: string) => {
    const numValue = Number.parseInt(value, 10) || 0
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(((prev[questionId] as QuestionInputAnswer) || {}) as QuestionInputAnswer),
        [inputId]: numValue,
      },
    }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setPage("submit")
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      localStorage.removeItem("questionnaire_answers")
      router.push("/report")
    }, 2000)
  }

  if (page === "home") {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <header className="px-5 pt-14 pb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🍋</span>
              <h1 className="text-lg font-bold text-foreground">{content.home.title}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{content.home.subtitle}</p>
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
              {content.home.primaryCta}
            </button>
            <p className="text-sm text-primary-foreground mt-4">{content.home.supportingNote}</p>
          </div>
        </main>

        <footer className="px-5 pb-24 text-center">
          <p className="text-xs text-muted-foreground">{content.home.footerNote}</p>
        </footer>

        <SharedNav />
      </div>
    )
  }

  if (page === "submit") {
    const answeredCount = Object.keys(answers).length

    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <header className="px-5 pt-14 pb-4 text-center">
          <h1 className="text-lg font-bold text-foreground">{content.submit.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{content.submit.subtitle}</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-5">
          <div
            className="w-full bg-card rounded-xl p-6 border border-border text-center"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <p className="text-base font-bold text-foreground">
              {content.submit.progressLabelPrefix} {answeredCount}/{totalQuestions} {content.submit.progressLabelSuffix}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {answeredCount < 5 ? content.submit.lowAnswerWarning : content.submit.defaultWarning}
            </p>
          </div>

          <div className="flex gap-3 mt-8 w-full">
            <button
              onClick={() => setPage("fill")}
              className="flex-1 py-3 bg-card border border-border text-foreground text-base font-medium rounded-lg"
            >
              {content.submit.backCta}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary text-primary-foreground text-base font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                content.submit.confirmCta
              )}
            </button>
          </div>
        </main>

        <SharedNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
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

      <main className="flex-1 px-5 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-primary">{currentQ.id}</span>
            <span className="text-base text-foreground">{currentQ.content}</span>
          </div>
        </div>

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
                  {"icon" in option && option.icon && <span className="text-xl">{option.icon}</span>}
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
                    value={(answers[currentQ.id] as QuestionInputAnswer | undefined)?.[input.id] || ""}
                    onChange={(event) => handleInputChange(currentQ.id, input.id, event.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-border text-base text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <span className="text-sm text-muted-foreground">{input.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
            {content.navigation.previous}
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
            {currentQuestion === totalQuestions - 1 ? content.navigation.submit : content.navigation.next}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
