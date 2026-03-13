"use client"
import { useState } from "react"
import { ClipboardList, Flame, Leaf, ChevronRight, Clock, TrendingUp } from "lucide-react"
import { SharedNav } from "./shared-nav"

export function ReportPage() {
  const [userData] = useState({
    userName: "小柠檬",
    userTag: "儿童 · 4-12岁",
    totalScore: 82,
    updateTime: "今天10:30",
  })

  const [dimensionScores] = useState([
    { name: "问卷评估", score: 85, icon: ClipboardList, color: "#90EE90" },
    { name: "打卡表现", score: 78, icon: Flame, color: "#F59E0B" },
    { name: "营养达标", score: 80, icon: Leaf, color: "#27AE60" },
  ])

  const [trendData] = useState([
    { date: "01-20", score: 75 },
    { date: "01-21", score: 78 },
    { date: "01-22", score: 76 },
    { date: "01-23", score: 80 },
    { date: "01-24", score: 79 },
    { date: "01-25", score: 81 },
    { date: "01-26", score: 82 },
  ])

  const [advantages] = useState(["蔬菜摄入充足", "作息规律"])
  const [gaps] = useState(["维生素D不足", "运动量偏少"])

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { text: "营养状态良好", color: "#27AE60" }
    if (score >= 60) return { text: "营养基本均衡", color: "#F59E0B" }
    return { text: "营养缺口较大", color: "#E63946" }
  }

  const scoreLevel = getScoreLevel(userData.totalScore)
  const maxScore = Math.max(...trendData.map(d => d.score))
  const minScore = Math.min(...trendData.map(d => d.score))

  return (
    <div className="min-h-screen bg-muted flex flex-col max-w-md mx-auto relative pb-20">
      {/* 顶部信息栏 */}
      <div 
        className="w-full px-5 py-6"
        style={{ background: "linear-gradient(135deg, #90EE90 0%, #66CDAA 100%)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white border-4 border-white/50 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">L</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{userData.userName}</h2>
              <p className="text-sm text-white/80">{userData.userTag} · 更新：{userData.updateTime}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 text-center">
            <p className="text-2xl font-bold" style={{ color: scoreLevel.color }}>{userData.totalScore}</p>
            <p className="text-xs" style={{ color: scoreLevel.color }}>{scoreLevel.text}</p>
          </div>
        </div>
      </div>

      {/* 多维度得分卡片 */}
      <div className="px-5 -mt-3 relative z-10">
        <div className="grid grid-cols-3 gap-2">
          {dimensionScores.map((item) => (
            <div 
              key={item.name}
              className="bg-white rounded-xl p-4 shadow-sm border border-border flex flex-col items-center gap-2"
            >
              <item.icon className="w-6 h-6" style={{ color: item.color }} />
              <span className="text-xl font-bold" style={{ color: item.color }}>{item.score}分</span>
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 数据趋势图表 */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-foreground">近7天得分趋势</span>
          </div>
          
          {/* 简化图表 */}
          <div className="h-32 flex items-end justify-between gap-1 px-2">
            {trendData.map((item, index) => (
              <div key={item.date} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-muted-foreground">{item.score}</span>
                <div 
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{ 
                    height: `${((item.score - minScore + 10) / (maxScore - minScore + 20)) * 80}px`,
                    background: index === trendData.length - 1 
                      ? "linear-gradient(180deg, #90EE90 0%, #66CDAA 100%)"
                      : "#E8FFE8"
                  }}
                />
                <span className="text-xs text-muted-foreground">{item.date.split("-")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 优势与缺口 */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-semibold text-foreground">优势保持 & 核心缺口</span>
            <div className="flex-1 h-0.5 bg-primary ml-2" style={{ maxWidth: "80px" }} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              {advantages.map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs">v</span>
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div>
              {gaps.map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-xs">!</span>
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 打卡关联建议 */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">打卡优化建议</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            连续打卡3天可改善维生素D不足问题，建议加入
            <span className="text-primary font-medium underline">"晒太阳"打卡项</span>
          </p>
        </div>
      </div>

      {/* 历史报告 */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-foreground">历史报告</span>
          </div>
          <button className="flex items-center gap-1 text-primary text-sm font-medium">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 底部更新提示 */}
      <div className="px-5 mt-6 pb-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">报告每日0点自动更新，同步昨日打卡数据</span>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
