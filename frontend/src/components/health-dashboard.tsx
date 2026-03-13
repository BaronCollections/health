"use client"
import { useState, useRef, useEffect } from "react"
import { Flame, Award, Check, ChevronRight } from "lucide-react"
import { SharedNav } from "./shared-nav"

// 打卡项目数据
const defaultCheckInItems = [
  { id: 1, icon: "vegetable", title: "完成今日蔬菜摄入", status: "pending" },
  { id: 2, icon: "exercise", title: "每日30分钟户外活动", status: "pending" },
  { id: 3, icon: "sleep", title: "22点前入睡", status: "pending" },
]

export function HealthDashboard() {
  const [continuousDays, setContinuousDays] = useState(7)
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [fillProgress, setFillProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [items, setItems] = useState(defaultCheckInItems)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const fillInterval = useRef<NodeJS.Timeout | null>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  const medalTargetDays = 10
  const medalRemainingDays = medalTargetDays - continuousDays

  const triggerHaptic = (type: "light" | "medium" | "success") => {
    if ("vibrate" in navigator) {
      switch (type) {
        case "light":
          navigator.vibrate(10)
          break
        case "medium":
          navigator.vibrate(20)
          break
        case "success":
          navigator.vibrate([30, 50, 30, 50, 50])
          break
      }
    }
  }

  const handleLongPressStart = () => {
    if (todayCheckedIn) return
    
    setIsLongPressing(true)
    setFillProgress(0)
    triggerHaptic("medium")

    let progress = 0
    fillInterval.current = setInterval(() => {
      progress += 3.33
      setFillProgress(Math.min(progress, 100))
      if (progress >= 33 || progress >= 66) {
        triggerHaptic("light")
      }
    }, 100)

    longPressTimer.current = setTimeout(() => {
      if (fillInterval.current) clearInterval(fillInterval.current)
      setIsLongPressing(false)
      setFillProgress(100)
      triggerHaptic("success")
      
      setTodayCheckedIn(true)
      setContinuousDays(prev => prev + 1)
      
      const points = Math.floor(Math.random() * 41) + 10
      setEarnedPoints(points)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        setFillProgress(0)
      }, 3000)
    }, 3000)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    if (fillInterval.current) clearInterval(fillInterval.current)
    
    if (fillProgress < 100) {
      setIsLongPressing(false)
      setFillProgress(0)
    }
  }

  const handleItemCheckIn = (itemId: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: "done" } : item
    ))
    triggerHaptic("light")
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
      if (fillInterval.current) clearInterval(fillInterval.current)
    }
  }, [])

  const getCalendarDays = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: 0, status: "empty" })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate()
      const isCheckedIn = i >= today.getDate() - 7 && i < today.getDate()
      days.push({ 
        day: i, 
        status: isToday ? "today" : isCheckedIn ? "checked" : "unchecked" 
      })
    }
    return days
  }

  const calendarDays = getCalendarDays()
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* 打卡成功弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="bg-primary text-primary-foreground px-10 py-6 rounded-3xl shadow-2xl">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mb-2">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <p className="text-2xl font-bold">打卡成功</p>
                <p className="text-white/80 text-sm">连续打卡 {continuousDays} 天</p>
              </div>
            </div>
            <div className="bg-card px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">今日获得能量</p>
                <p className="text-2xl font-bold text-primary">+{earnedPoints}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 顶部区域 */}
      <header className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">每日健康打卡</h1>
          <button className="flex items-center gap-1 text-sm text-primary font-medium">
            打卡记录
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 连续打卡徽章 */}
      <div className="px-5 mb-6">
        <div className="flex flex-col items-center">
          <div
            ref={badgeRef}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer select-none transition-transform bg-primary ${
              isLongPressing ? "scale-95" : todayCheckedIn ? "bg-chart-2" : "hover:scale-105"
            }`}
            style={{
              border: "3px solid var(--accent)",
              boxShadow: "0 4px 16px rgba(255, 209, 102, 0.4)",
            }}
          >
            {fillProgress > 0 && !todayCheckedIn && (
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-100 pointer-events-none overflow-hidden"
                style={{
                  height: `${fillProgress}%`,
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: fillProgress >= 100 ? "9999px" : undefined,
                }}
              />
            )}
            
            <div className="flex items-center gap-1 relative z-10">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="text-center relative z-10">
              <p className="text-[10px] text-white font-medium">连续打卡</p>
              <p className="text-lg text-white font-bold">{continuousDays}天</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {todayCheckedIn 
                ? "今日已打卡，明天继续加油" 
                : `长按徽章完成打卡，距离勋章还有${medalRemainingDays}天`}
            </span>
          </div>
        </div>
      </div>

      {/* 今日打卡项 */}
      <div className="px-5 mb-6">
        <h2 className="text-base font-bold text-foreground mb-3">今日打卡</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                item.status === "done"
                  ? "bg-green-50 border-green-100"
                  : "bg-card border-border"
              }`}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === "done" ? "bg-chart-2" : "bg-secondary"
                }`}>
                  {item.status === "done" ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {item.icon === "vegetable" && "🥬"}
                      {item.icon === "exercise" && "🏃"}
                      {item.icon === "sleep" && "😴"}
                    </span>
                  )}
                </div>
                <span className={`text-sm ${item.status === "done" ? "text-chart-2" : "text-foreground"}`}>
                  {item.title}
                </span>
              </div>
              {item.status === "done" ? (
                <Check className="w-5 h-5 text-chart-2" />
              ) : (
                <button
                  onClick={() => handleItemCheckIn(item.id)}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  打卡
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 打卡日历 */}
      <div className="px-5 mb-24">
        <div className="bg-card rounded-xl border border-border p-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h3 className="text-base font-bold text-foreground text-center mb-4">
            {new Date().getFullYear()}年{new Date().getMonth() + 1}月
          </h3>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center text-sm rounded-full ${
                  item.status === "empty" ? "" :
                  item.status === "today" ? "border-2 border-destructive text-destructive font-bold" :
                  item.status === "checked" ? "bg-primary text-primary-foreground" :
                  "text-muted-foreground"
                }`}
              >
                {item.day > 0 && item.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
