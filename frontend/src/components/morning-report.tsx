"use client"

import React, { useRef, useState } from "react"

import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLocale } from "@/i18n/use-locale"
import { getReportContent } from "@/lib/report"
import type { ReportGoalId } from "@/lib/report/types"

import { SharedNav } from "./shared-nav"

function PillIcon({ color, type }: { color: string; type: string }) {
  switch (type) {
    case "capsule":
      return <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "capsule-long":
      return <div className={`w-5 h-16 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "round":
      return <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "oval":
      return <div className={`w-10 h-6 rounded-full bg-gradient-to-r ${color} shadow-sm`} />
    case "softgel":
      return <div className={`w-8 h-12 rounded-full bg-gradient-to-b ${color} shadow-sm`} style={{ borderRadius: "40%" }} />
    default:
      return <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
  }
}

export function MorningReport() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const report = getReportContent(locale)
  const defaultGoalId = report.goalsSection.items[0]?.id ?? report.goalsSection.primaryGoalId
  const nutritionCards = report.nutritionSection.cards as Record<ReportGoalId, (typeof report.nutritionSection.cards)[keyof typeof report.nutritionSection.cards]>

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<ReportGoalId>(defaultGoalId)
  const containerRef = useRef<HTMLDivElement>(null)
  const nutritionSectionRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const primaryGoal = report.goalsSection.items.find((goal) => goal.id === report.goalsSection.primaryGoalId)
  const scores = report.dimensions.map((dimension) => ({
    ...dimension,
    value: report.metrics.scores[dimension.id as keyof typeof report.metrics.scores],
  }))

  const scrollToNutritionPlan = (goalId: ReportGoalId) => {
    setSelectedGoal(goalId)
    nutritionSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const radarSize = 180
  const center = radarSize / 2
  const maxRadius = 70

  const getPoint = (angle: number, value: number) => {
    const radius = (value / 100) * maxRadius
    const radian = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    }
  }

  const radarPoints = scores.map((score) => getPoint(score.angle, score.value))
  const radarPath = radarPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  const totalPages = 5

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
    touchEndX.current = event.touches[0].clientX
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1)
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
      }
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToPage = (index: number) => {
    setCurrentPage(index)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    touchStartX.current = event.clientX
    touchEndX.current = event.clientX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      touchEndX.current = moveEvent.clientX
    }

    const handleMouseUp = () => {
      const diff = touchStartX.current - touchEndX.current
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage < totalPages - 1) {
          setCurrentPage((prev) => prev + 1)
        } else if (diff < 0 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1)
        }
      }
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      <div className="flex items-center justify-center px-4 py-3 bg-white border-b border-border">
        <span className="text-base font-medium text-foreground">{t("brand.name")}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          ref={containerRef}
          className="min-h-[calc(100vh-140px)] relative overflow-hidden select-none cursor-grab active:cursor-grabbing bg-white"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute inset-0 flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <div className="mb-4">
                  <h1 className="text-lg font-bold text-foreground">
                    {report.profile.userName}
                    {report.header.ownerSuffix}
                  </h1>
                  <h2 className="text-lg font-bold text-foreground">{report.header.posterTitle}</h2>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">{report.bmi.label}</span>
                    <span className="text-3xl font-bold text-foreground ml-auto">{report.metrics.bmi}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{report.bmi.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.scoreSummary.label}
                    <span className="text-2xl font-bold text-foreground ml-2">{report.metrics.totalScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mb-4">{report.scoreSummary.footnote}</p>

                  <div className="flex justify-center">
                    <div className="relative">
                      <svg width={radarSize} height={radarSize}>
                        {[20, 40, 60, 80, 100].map((level) => {
                          const radius = (level / 100) * maxRadius
                          return <circle key={level} cx={center} cy={center} r={radius} fill="none" stroke="#F0F0F0" strokeWidth="1" />
                        })}
                        {scores.map((score) => {
                          const point = getPoint(score.angle, 100)
                          return <line key={score.id} x1={center} y1={center} x2={point.x} y2={point.y} stroke="#F0F0F0" strokeWidth="1" />
                        })}
                        <path d={radarPath} fill="rgba(109, 181, 120, 0.15)" stroke="#6DB578" strokeWidth="2" />
                        {radarPoints.map((point, index) => (
                          <circle key={scores[index].id} cx={point.x} cy={point.y} r="4" fill="#6DB578" />
                        ))}
                        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#333">
                          {report.metrics.totalScore}
                        </text>
                      </svg>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {scores[0].label} {scores[0].value}
                      </div>
                      <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs text-muted-foreground">
                        {scores[1].label} {scores[1].value}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {scores[2].label} {scores[2].value}
                      </div>
                      <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs text-muted-foreground">
                        {scores[3].label} {scores[3].value}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{report.goalsSection.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.goalsSection.items.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => scrollToNutritionPlan(goal.id)}
                        className="px-4 py-2 bg-[#E8F5E8] rounded-full text-sm text-primary font-medium hover:bg-primary hover:text-white active:scale-95 transition-all"
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">{report.goalsSection.primaryLabel}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E8] rounded-full text-sm text-primary font-medium">
                    <span className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                    {primaryGoal?.label}
                  </span>
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">{report.header.swipeHint}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto mt-1" />
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <div className="mb-8">
                  <h3 className="text-base font-bold text-foreground mb-4">{report.dailyGoalSection.title}</h3>
                  <div className="flex gap-4">
                    <div className="text-4xl">{report.dailyGoalSection.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-2">{report.dailyGoalSection.itemTitle}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{report.dailyGoalSection.description}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground mb-4">{report.specialRemindersSection.title}</h3>
                  <div className="space-y-4">
                    {report.specialRemindersSection.items.map((reminder) => (
                      <div key={reminder} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{reminder}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <h3 className="text-base font-bold text-foreground mb-4">{report.dietAdviceSection.title}</h3>
                <div className="space-y-5">
                  {report.dietAdviceSection.items.map((advice) => (
                    <div key={advice.id}>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        <span className="text-primary mr-2">{advice.number}</span>
                        {advice.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{advice.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <h3 className="text-base font-bold text-foreground mb-4">{report.exerciseAdviceSection.title}</h3>
                <div className="space-y-5">
                  {report.exerciseAdviceSection.items.map((advice) => (
                    <div key={advice.id}>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        <span className="text-primary mr-2">{advice.number}</span>
                        {advice.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{advice.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-xs text-muted-foreground mb-4">{report.exerciseAdviceSection.footnote}</p>
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-[280px]">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF8F0] flex items-center justify-center">
                      <span className="text-2xl">{report.closingSection.icon}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{report.closingSection.note}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-8">
                  <button
                    onClick={() => router.push("/ocr-confirmation")}
                    className="w-full py-3.5 border border-border rounded-full text-foreground font-medium bg-white"
                  >
                    {report.closingSection.secondaryCta}
                  </button>
                  <button
                    onClick={() => scrollToNutritionPlan(report.goalsSection.primaryGoalId)}
                    className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
                  >
                    {report.closingSection.primaryCta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 py-3 bg-white">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`rounded-full transition-all duration-300 ${
                currentPage === index
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <div ref={nutritionSectionRef} className="bg-[#F8F8F8] px-4 pt-4 pb-24">
          <h3 className="text-lg font-bold text-foreground mb-2">{report.nutritionSection.title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{report.nutritionSection.description}</p>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {report.goalsSection.items.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedGoal === goal.id
                    ? "bg-primary text-white"
                    : "bg-white text-foreground hover:bg-[#E8F5E8]"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nutritionCards[selectedGoal].map((card) => (
              <button
                key={card.id}
                className="bg-white rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-2 gap-3">
                  <span className="text-xl font-light text-foreground">{card.category}</span>
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <PillIcon color={card.color} type={card.type} />
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground mb-2">{card.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{card.benefit}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
